import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExamResult } from "./interfaces/examResult.interface";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";
import { environment } from 'environment';
import { UserService } from "../user/user.service";

@Injectable()
export class ExamResultService {

    constructor(
        @InjectModel('ExamResult') private readonly erModel: Model<ExamResult>,
        private readonly userService: UserService,
    ) { }

    async create(input: ExamResultInput): Promise<ExamResultDto> {
        const existing = await this.erModel.findOne({ user: input.user,  exam: input.exam });
        if(existing) throw new NotAcceptableException('User has already an exam result for the given exam!');
        const examResult = new this.erModel({...input, reportUri: ""}); // Setting the reportUri to an empty string, because the file gets uploaded separately

        // Update participant rank
        this.userService.updateRank(input.user ,input.martialArt._id , input.rank);

        return examResult.save();
    }

    async findById(id: string): Model<ExamResult> {
        const result = await this.erModel.findOne({ _id: id });
        if(!result) throw new NotFoundException(`No exam result with _id: "${id}" found.`);
        return result;
    }

    async findByExam(userId: string, examId: string): Promise<ExamResultDto> {
        const result = await this.erModel.findOne({ exam: examId, user: userId })/* .populate('martialArt').exec() */;
        if(!result) return null;
        return result;
    }

    async findAll(userId: string): Promise<ExamResultDto[]> {
        const results = await this.erModel.find({ user: userId });
        if(!results) throw new NotFoundException(`No exam results found.`);
        results.forEach(result => {
            result.reportUri =  environment.URL+'/protocols/'+result._id;
            result.date = new Date(result.date);
        });
        return results;
    }

    async addReportUri(id: string, uri: string): Promise<ExamResultDto> {
        const examResult = await this.erModel.findOne({ _id: id });
        if(!examResult) throw new NotFoundException(`Could not find any exam result with _id: "${id}"`);
        examResult.reportUri = uri;
        return examResult.save();
    }

    async update(id: string, input: ExamResultInput): Promise<ExamResultDto> {
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