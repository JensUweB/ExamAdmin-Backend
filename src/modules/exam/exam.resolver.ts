import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamService } from "./exam.service";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";
import { UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { User as CurrentUser } from "../decorators/user.decorator";

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

    @Mutation(() => String,{description: 'Deletes the exam with given examId, if exam.examiner equals current user'})
    async deleteExam(@CurrentUser() user: any, @Args('examId') examId: string) {
        const res = await this.examService.deleteExam(user.userId, examId);

        switch(res){
            case 1: {return 'Success';}
            case 0: {return 'Error: delete exam failed';}
            case -1: {return 'Error: exam not found';}
            case -2: {return 'Error: Not authorized to delete this exam';}
            default: {return 'Unexpected Server Error';}
        }
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}