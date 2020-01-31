import { Injectable, UnauthorizedException, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Exam } from "./interfaces/exam.interface";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";
import { UserService } from "../user/user.service";

@Injectable()
export class ExamService {

    constructor(@InjectModel('Exam') private readonly examModel: Model<Exam>, private readonly userService: UserService) {}

    async findById(id: string, userId: string): Promise<ExamDto> {
        const exam = await this.examModel.findOne({_id: id});
        const user = await this.userService.findById(userId);
        let isAllowed = false;
        
        if(user.clubs.some(item => item.club._id == exam.club.toString()) || exam.isPublic) isAllowed = true;

        if(!exam) throw new NotFoundException(`No exam with _id: "${id}" found.`);
        if(!isAllowed) throw new UnauthorizedException('You are not authorized to view this exam!');
        return exam;
    }
    
    async findAll(userId): Promise<ExamDto[]> {
        const exams = await this.examModel.find().populate('martialArt').populate('club').exec();
        const user = await this.userService.findById(userId);
        if(!exams) throw new NotFoundException(`No exam found. Please create one first.`);
        
        const array = await exams.filter(exam => {
            return exam.isPublic == true || user.clubs.some(item => item.club._id == exam.club.toString()); 
        });

        if(!array.length) throw new NotFoundException('No exams from your clubs or public ones found.');
        return array;
    }

    async create(input: ExamInput): Promise<ExamDto> {
        const exam = new this.examModel(input);
        if(!exam) throw new NotAcceptableException('If you see this error, your inputs are propably wrong.');
        return exam.save();
    }

    async update(id: string, input: ExamInput): Promise<ExamDto> {
        let exam = await this.examModel.findOne({_id: id});
        if(!exam) throw new NotFoundException(`No exam with _id: "${id}" found!`);
        if(input.title) exam.title = input.title;
        if(input.description) exam.description = input.description;
        if(input.examDate) exam.examDate = input.examDate;
        if(input.regEndDate) exam.regEndDate = input.regEndDate;
        if(input.club) exam.club = input.club;
        if(input.examiner) exam.examiner = input.examiner;
        if(input.martialArt) exam.martialArt = input.martialArt;
        if(input.participants) exam.participants = input.participants;
        return exam.save();
    }

    async deleteExam(userId: string, examId: string): Promise<Boolean> {
        const exam = await this.examModel.findOne({_id: examId});
        if(!exam) throw new NotFoundException(`No exam with _id: "${examId}" found!`);
        if(exam.examiner.toString() != userId) throw new UnauthorizedException('You are not authorized to delete this exam.');
        
        const result = await this.examModel.deleteOne({_id: examId});
        if(result) return true;
        return false;
    }
}