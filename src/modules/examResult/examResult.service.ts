import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExamResult } from "./interfaces/examResult.interface";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";

@Injectable()
export class ExamResultService {

    constructor(@InjectModel('ExamResult') private readonly erModel: Model<ExamResult>) { }

    async create(input: ExamResultInput): Promise<ExamResultDto | Error> {
        const existing = await this.erModel.findOne({ user: input.user,  exam: input.exam });
        if(existing) throw new NotAcceptableException('User has already an exam result for the given exam!');
        const examResult = new this.erModel({...input, reportUri: ""}); // Setting the reportUri to an empty string, because the file gets uploaded separately
        return examResult.save();
    }

    async findById(id: string): Model<ExamResult> {
        const result = await this.erModel.findOne({ _id: id });
        if(!result) throw new NotFoundException(`No exam result with _id: "${id}" found.`);
        return result;
    }

    async findAll(userId: string): Promise<ExamResultDto[]> {
        const result = await this.erModel.find({ user: userId });
        if(!result) throw new NotFoundException(`No exam results found.`);
        return result;
    }

    async addReportUri(id: string, uri: string): Promise<ExamResultDto | undefined> {
        const examResult = await this.erModel.findOne({ _id: id });
        if(!examResult) throw new NotFoundException(`Could not find any exam result with _id: "${id}"`);
        examResult.reportUri = uri;
        return examResult.save();
    }

    async update(id: string, input: ExamResultInput): Promise<ExamResultDto | undefined> {
        const examResult = await this.erModel.findOne({ _id: id });
        if(!examResult) throw new NotFoundException(`Could not find any exam result with _id: "${id}"`);
        if(input.user) examResult.user = input.user;
        if(input.exam) examResult.exam = input.exam;
        if(input.martialArt) examResult.martialArt = input.martialArt;
        if(input.examiner) examResult.examiner = input.examiner;
        if(input.rank) examResult.rank = input.rank;
        if(input.date) examResult.date = input.date;
        if(input.passed) examResult.passed = input.passed;

        return examResult.save();
    }

    async deleteAllRelated(userId: string): Promise<Boolean>{
       const result = await this.erModel.deleteMany({'user': userId});
       if(!result) throw new NotFoundException('No exam results related to this user found!');
       return true;
    }
}