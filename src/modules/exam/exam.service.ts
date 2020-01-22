import { Injectable, UnauthorizedException, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Exam } from "./interfaces/exam.interface";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";

@Injectable()
export class ExamService {

    constructor(@InjectModel('Exam') private readonly examModel: Model<Exam>) {}

    async findById(id: string): Model<Exam | undefined> {
        const result = await this.examModel.findOne({_id: id});
        if(!result) throw new NotFoundException(`No exam with _id: "${id}" found.`);
        return result;
    }
    
    async findAll(): Promise<ExamDto[]> {
        const result = await this.examModel.find();
        if(!result) throw new NotFoundException(`No exam found. Please create one first.`);
        return result;
    }

    async create(input: ExamInput): Promise<ExamDto> {
        const exam = new this.examModel(input);
        if(!exam) throw new NotAcceptableException('If you see this error, your inputs are propably wrong.');
        return exam.save();
    }

    async update(id: string, input: ExamInput): Promise<ExamDto> {
        let exam = await this.findById(id);
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