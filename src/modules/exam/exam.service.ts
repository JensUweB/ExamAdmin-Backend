import { Injectable, UnauthorizedException, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam } from './interfaces/exam.interface';
import { ExamDto } from './dto/exam.dto';
import { ExamInput } from './inputs/exam.input';
import { UserService } from '../user/user.service';
import { ExamResultService } from '../examResult/examResult.service';
import { MartialArtsService } from '../martialArts/martialArts.Service';

@Injectable()
export class ExamService {

    constructor(
        @InjectModel('Exam') private readonly examModel: Model<Exam>,
        private readonly userService: UserService,
        private readonly maService: MartialArtsService,
        private erService: ExamResultService,
    ) { }

    async findById(id: string, userId: string): Promise<ExamDto> {
        const exam: any = await this.examModel.findOne({ _id: id });
        const user = await this.userService.findById(userId);
        let isAllowed = false;

        if (user.clubs.some(item => item.club._id === exam.club.toString()) || exam.isPublic) { isAllowed = true; }

        if (!exam) { throw new NotFoundException(`No exam with _id: "${id}" found.`); }
        if (!isAllowed) { throw new UnauthorizedException('You are not authorized to view this exam!'); }
        return exam;
    }

    async findAll(userId, minDate): Promise<ExamDto[]> {
        let exams: any = await this.examModel.find()
            .populate('martialArt').populate('examiner').populate('participants').exec();
        if (!exams || exams.length === 0) { throw new NotFoundException(`No exam found. Please create one first.`); }
        if (minDate) {
                exams = exams.filter(item => item.examDate >= minDate);
        }
        return exams;
    }

    async create(input: ExamInput): Promise<ExamDto> {
        const exam: any = new this.examModel(input);
        if (!exam) { throw new NotAcceptableException('If you see this error, your inputs are propably wrong.'); }
        return exam.save();
    }

    async getOpenExams(userId: any): Promise<ExamDto[]> {
        let exams: any = await this.examModel.find().populate('martialArt').populate('participants').exec();

        // Get all exams created from the current user
        exams = await exams.filter(exam => exam.examiner === userId);
        if (exams === [] || !exams.length) { throw new NotFoundException('Sorry, could not find any exams created by you!'); }

        for (const exam of exams) {
            if (exam.participants.length) {
                for (let participant of exam.participants) {
                        // Tries to find an exam result for this exam for the current user
                        const result = await this.erService.findByExam(participant._id, exam._id);
                        // Removes participant from list if an result already exists
                        if (result !== null && result !== undefined) {
                            participant = participant.filter(item => item._id !== participant._id);
                        }
                }
            }
            // If we had to remove all participants previously, we can remove the exam too.
            if (exam.participants?.length === 0) {
                exams = exams.filter(item => item._id !== exam._id);
            }
        }

        if (exams.length === 0) { throw new NotFoundException('No exams with missing exam results found!'); }
        return exams;
    }

    async getUserExams(userId: any, minDate: Date): Promise<ExamDto[]> {
        const user = await this.userService.findById(userId);
        if (!user) { throw new UnauthorizedException('You are not authorized!'); }

        let exams: any = await this.examModel.find().populate('martialArt').populate('examiner')
        .populate('participants').exec();
        if (!exams && !exams.length) { throw new NotFoundException('No exams found!'); }

        // Search for exams where user is examiner or participant and where examDate is greater than minDate
        exams = exams.filter((exam) => {
            if (exam.examiner._id.toString() === userId) {
                if (exam.examDate >= minDate) { return true; }
             }
            if (exam.participants.some((item) => item._id.toString() === userId)) {
                if (exam.examDate >= minDate) { return true; }
             }
        });
        if (!exams && !exams.length) { throw new NotFoundException('No exams found!'); }

        return exams;
    }

    async update(userId, id: string, input: ExamInput): Promise<ExamDto> {
        const exam: any = await this.examModel.findOne({ _id: id });
        const user = await this.userService.findById(userId);

        if (exam.examiner._id.toString() !== user._id.toString()) { throw new UnauthorizedException('You are not authorized to update this exam!'); }
        if (!exam) { throw new NotFoundException(`No exam with _id: "${id}" found!`); }

        if (input.title) { exam.title = input.title; }
        if (input.description) { exam.description = input.description; }
        if (input.price) { exam.price = input.price; }
        if (input.examDate) { exam.examDate = input.examDate; }
        if (input.regEndDate) { exam.regEndDate = input.regEndDate; }
        if (input.club) { exam.club = input.club; }
        if (input.examiner) { exam.examiner = input.examiner; }
        if (input.martialArt) { exam.martialArt = input.martialArt; }
        if (input.participants) { exam.participants = input.participants; }
        if (input.examPlace) { exam.examPlace = input.examPlace; }
        return exam.save();
    }

    async registerToExam(userId: any, examId: string): Promise<boolean> {
        const exam: any = await this.examModel.findOne({ _id: examId });
        const user = await this.userService.findById(userId);

        if (user.clubs.length > 0 && !exam.isPublic) {
            if (!user.clubs.some(club => club.club._id === exam.club._id.toString())) {throw new UnauthorizedException('You are not authorized to register for this exam!'); }
        }
        if (exam.participants.includes(userId)) {throw new NotAcceptableException('You are already listed as participant!'); }

        // Check if the user has the required min rank
        if (exam.minRank) {
            const ma = await this.maService.findByRank(exam.minRank);
            const userMa = user.martialArts.filter(item => item._id._id === ma._id);

            if (ma) {
                const examRank = await this.maService.findRank(exam.minRank);
                if (examRank && userMa.length) {
                    if (userMa.length > 0) {
                        if (userMa[0]._id.ranks[0].number > examRank.number) { throw new UnauthorizedException('You are not allowed to register to this exam!'); }
                    } else { throw new UnauthorizedException('You are not allowed to register to this exam!'); }
                }
            }

        }
        exam.participants.push(userId);
        exam.save();
        return true;
    }

    async unregisterFromExam(userId: any, examId: string): Promise<boolean> {
        const exam: any = await this.examModel.findOne({ _id: examId });
        const currentUser = await this.userService.findById(userId);

        if (!currentUser) { throw new NotFoundException('User not found!'); }
        if (!exam) { throw new NotFoundException('Exam not found!'); }
        if (!exam.participants.some(user => user._id === userId)) { return false; } else {
            exam.participants = exam.participants.filter(user => user !== userId);
            if (exam.minRank === undefined) {exam.minRank = null; }
            exam.save();
            return true;
        }
    }

    async deleteExam(userId: string, examId: string): Promise<boolean> {
        const exam = await this.examModel.findOne({ _id: examId });
        if (!exam) { throw new NotFoundException(`No exam with _id: "${examId}" found!`); }
        if (exam.examiner.toString() !== userId) { throw new UnauthorizedException('You are not authorized to delete this exam.'); }

        const result = await this.examModel.deleteOne({ _id: examId });
        return !!result;
    }
}
