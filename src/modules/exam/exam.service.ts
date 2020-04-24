import { Injectable, UnauthorizedException, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Exam } from "./interfaces/exam.interface";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";
import { UserService } from "../user/user.service";
import { ExamResultService } from "../examResult/examResult.service";
import { MartialArtsService } from "../martialArts/martialArts.Service";

@Injectable()
export class ExamService {

    constructor(
        @InjectModel('Exam') private readonly examModel: Model<Exam>,
        private readonly userService: UserService,
        private readonly maService: MartialArtsService,
        private erService: ExamResultService
    ) { }

    async findById(id: string, userId: string): Promise<ExamDto> {
        const exam = await this.examModel.findOne({ _id: id });
        const user = await this.userService.findById(userId);
        let isAllowed = false;

        if (user.clubs.some(item => item.club._id == exam.club.toString()) || exam.isPublic) isAllowed = true;

        if (!exam) throw new NotFoundException(`No exam with _id: "${id}" found.`);
        if (!isAllowed) throw new UnauthorizedException('You are not authorized to view this exam!');
        return exam;
    }

    async findAll(userId): Promise<ExamDto[]> {
        let exams = await this.examModel.find()
            .populate('martialArt').populate('club').populate('examiner').populate('participants').exec();
        const user = await this.userService.findById(userId);
        if (!exams) throw new NotFoundException(`No exam found. Please create one first.`);

        // Check if exam is visible or not
        exams = await exams.filter(exam => {
            return exam.isPublic == true || user.clubs.some(item => item.club._id.toString() == exam.club._id.toString());
        });

        if (!exams.length) throw new NotFoundException('No exams from your clubs or public ones found.');
        return exams;
    }

    async create(input: ExamInput): Promise<ExamDto> {
        const exam = new this.examModel(input);
        if (!exam) throw new NotAcceptableException('If you see this error, your inputs are propably wrong.');
        return exam.save();
    }

    async getOpenExams(userId: any): Promise<ExamDto[]> {
        let exams = await this.examModel.find().populate('martialArt').populate('participants').exec();

        //Get all exams created from the current user
        exams = await exams.filter(exam => exam.examiner == userId);
        if (exams == [] || !exams.length) throw new NotFoundException('Sorry, could not find any exams created by you!');

        for (let i = 0; i < exams.length; i++) {
            if (exams[i].participants.length) {
                for (let j = 0; j < exams[i].participants.length; j++) {
                        // Tries to find an exam result for this exam for the current user
                        const result = await this.erService.findByExam(exams[i].participants[j]._id, exams[i]._id);
                        // Removes participant from list if an result already exists
                        if(result !== null && result !== undefined) {
                            exams[i].participants = exams[i].participants.filter(item => item._id != exams[i].participants[j]._id);
                        } 
                }
            }
            // If we had to remove all participants previously, we can remove the exam too.
            if (exams[i].participants === undefined || exams[i].participants === null || exams[i].participants.length == 0) {
                exams = exams.filter(item => item._id != exams[i]._id);
            }
        }

        if (exams.length == 0) throw new NotFoundException('No exams with missing exam results found!');
        return exams;
    }

    async update(userId, id: string, input: ExamInput): Promise<ExamDto> {
        let exam = await this.examModel.findOne({ _id: id });
        const user = await this.userService.findById(userId);

        if(exam.examiner._id.toString() != user._id.toString()) throw new UnauthorizedException('You are not authorized to update this exam!');
        if (!exam) throw new NotFoundException(`No exam with _id: "${id}" found!`);

        if (input.title) exam.title = input.title;
        if (input.description) exam.description = input.description;
        if (input.price) exam.price = input.price;
        if (input.examDate) exam.examDate = input.examDate;
        if (input.regEndDate) exam.regEndDate = input.regEndDate;
        if (input.club) exam.club = input.club;
        if (input.examiner) exam.examiner = input.examiner;
        if (input.martialArt) exam.martialArt = input.martialArt;
        if (input.participants) exam.participants = input.participants;
        if (input.examPlace) exam.examPlace = input.examPlace;
        return exam.save();
    }

    async registerToExam(userId: any, examId: String): Promise<boolean> {
        const exam = await this.examModel.findOne({ _id: examId });
        const user = await this.userService.findById(userId);

        if(user.clubs.length > 0 && !exam.isPublic) {
            if (!user.clubs.some(club => club.club._id == exam.club._id.toString())) {throw new UnauthorizedException('You are not authorized to register for this exam!');}
        }
        if (exam.participants.includes(userId)) {throw new NotAcceptableException('You are already listed as participant!');}
        
        // Check if the user has the required min rank
        if(exam.minRank) {
            let ma = await this.maService.findByRank(exam.minRank);
            let userMa = user.martialArts.filter(item => item._id._id == ma._id);
            
            if(ma) {
                let examRank = await this.maService.findRank(exam.minRank);
                if(examRank && userMa.length) {
                    if(userMa.length > 0) {
                        if(userMa[0]._id.ranks[0].number > examRank.number) { throw new UnauthorizedException('You are not allowed to register to this exam!');}
                    } else { throw new UnauthorizedException('You are not allowed to register to this exam!');}
                }
            }
            
        }
        exam.participants.push(userId);
        exam.save();
        return true;
    }

    async unregisterFromExam(userId: any, examId: String): Promise<boolean> {
        const exam = await this.examModel.findOne({ _id: examId });
        const user = await this.userService.findById(userId);

        if(!user) throw new NotFoundException('User not found!');
        if(!exam) throw new NotFoundException('Exam not found!');
        if(!exam.participants.some(user => user._id == userId)){ return false;}
        else { 
            exam.participants = exam.participants.filter(user => user._id != userId); 
            if(exam.minRank === undefined) {exam.minRank = null;}
            exam.save();
            return true;
        }
    }

    async deleteExam(userId: string, examId: string): Promise<Boolean> {
        const exam = await this.examModel.findOne({ _id: examId });
        if (!exam) throw new NotFoundException(`No exam with _id: "${examId}" found!`);
        if (exam.examiner.toString() != userId) throw new UnauthorizedException('You are not authorized to delete this exam.');

        const result = await this.examModel.deleteOne({ _id: examId });
        if (result) return true;
        return false;
    }
}