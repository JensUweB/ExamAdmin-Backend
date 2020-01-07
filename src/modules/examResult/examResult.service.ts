import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExamResult } from "./interfaces/examResult.interface";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";

@Injectable()
export class ExamResultService {

    constructor(@InjectModel('ExamResult') private readonly erModel: Model<ExamResult>) { }

    async create(input: ExamResultInput): Promise<ExamResultDto> {
        const examResult = new this.erModel(input);
        return examResult.save();
    }

    async findById(id: string): Model<ExamResult | undefined> {
        return this.erModel.findOne({ _id: id });
    }

    async findAll(userId: string): Promise<ExamResultDto[]> {
        return await this.erModel.find({ user: userId });
    }

    async update(id: string, input: ExamResultInput): Promise<ExamResultDto | undefined> {
        const examResult = await this.erModel.findOne({ _id: id });

        if(input.user) examResult.user = input.user;
        if(input.exam) examResult.exam = input.exam;
        if(input.martialArt) examResult.martialArt = input.martialArt;
        if(input.examiner) examResult.examiner = input.examiner;
        if(input.rank) examResult.rank = input.rank;
        if(input.date) examResult.date = input.date;
        if(input.reportUri) examResult.reportUri = input.reportUri;
        if(input.passed) examResult.passed = input.passed;

        return examResult.save();
    }
}