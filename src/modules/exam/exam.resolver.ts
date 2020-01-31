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
    async getAllExams(@CurrentUser() user: any) {
        try{ 
            const result = await this.examService.findAll(user.userId);
            console.log(result);
            return result;
        } catch (error) { return error; }
    }

    @Query(() => ExamDto, {description: 'Returns one exam with the given id'})
    async getExamById(@CurrentUser() user: any, @Args('id') id: string) {
        try{ return this.examService.findById(id, user.userId);
        } catch (error) { return error; }
    }

    @Query(() => [ExamDto], {description: 'Returns an array of all exams. Only exams with an future starting date included.'})
    async getPlannedExams(@CurrentUser() user: any) {
        try{ 
            let exams = await this.examService.findAll(user.userId);

            // Filter exams by date and return
            return await exams.filter(exam => exam.examDate > new Date(Date.now()));
        } catch (error) { return error; }
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => ExamDto, {description: 'Creates a new exam. DOH!'})
    async createExam(@Args('input') input: ExamInput) {
        try{ return this.examService.create(input);
        } catch (error) { return error; }
    }

    @Mutation(() => Boolean,{description: 'Deletes the exam with given examId, if exam.examiner equals current user'})
    async deleteExam(@CurrentUser() user: any, @Args('examId') examId: string) {
        try{ return this.examService.deleteExam(user.userId, examId);
        } catch (error) { return error; }
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}