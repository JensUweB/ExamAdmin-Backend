import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamService } from "./exam.service";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";
import { UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";

@UseGuards(GraphqlAuthGuard)
@Resolver('Exam')
export class ExamResolver {

    constructor(private readonly examService: ExamService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
    @Query(() => [ExamDto], {description: 'Returns an array of all exams. Including previous ones.'})
    async getAllExams() {
        return this.examService.findAll();
    }

    @Query(() => ExamDto, {description: 'Returns one exam with the given id'})
    async getExamById(@Args('id') id: string) {
        return this.examService.findById(id);
    }

    @Query(() => [ExamDto], {description: 'Returns an array of all exams. Only exams with an future starting date included.'})
    async getPlannedExams() {
        let exams = await this.examService.findAll();

        // Filter exams by date and return
        return await exams.filter(exam => exam.examDate > new Date(Date.now()));
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => ExamDto, {description: 'Creates a new exam. DOH!'})
    async createExam(@Args('input') input: ExamInput) {
        return this.examService.create(input);
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}