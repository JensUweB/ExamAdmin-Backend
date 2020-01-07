import { Injectable } from "@nestjs/common";
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
        exam.title = input.title;
        exam.description = input.description;
        exam.examDate = input.examDate;
        exam.regEndDate = input.regEndDate;
        exam.club = input.club;
        exam.examiner = input.examiner;
        exam.martialArt = input.martialArt;
        exam.participants = input.participants;
        return exam.save();
    }

}