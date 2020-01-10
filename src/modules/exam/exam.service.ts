import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Exam } from "./interfaces/exam.interface";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";

@Injectable()
export class ExamService {

    constructor(@InjectModel('Exam') private readonly examModel: Model<Exam>) {}

    async findById(id: string): Model<Exam | undefined> {
        return this.examModel.findOne({_id: id});
    }
    
    async findAll(): Promise<ExamDto[]> {
        return await this.examModel.find();
    }

    async create(input: ExamInput): Promise<ExamDto> {
        const exam = new this.examModel(input);
        return exam.save();
    }

    async update(id: string, input: ExamInput): Promise<ExamDto> {
        let exam = await this.findById(id);
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

    async deleteExam(userId: string, examId: string): Promise<Number> {
        const exam = await this.examModel.findOne({_id: examId});

        if(!exam) return -1;
        if(exam.examiner.toString() == userId) {
            const result = await this.examModel.deleteOne({_id: examId});
            if(result) return 1;
            return 0;
        } else return -2;
    }
}