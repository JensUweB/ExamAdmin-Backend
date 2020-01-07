import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamService } from "./exam.service";
import { ExamDto } from "./dto/exam.dto";
import { ExamInput } from "./inputs/exam.input";

@Resolver('Exam')
export class ExamResolver {

    constructor(private readonly examService: ExamService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
    @Query(() => [ExamDto])
    async getAllExams() {
        return this.examService.findAll();
    }

    @Query(() => ExamDto)
    async getExamById(@Args('id') id: string) {
        return this.examService.findById(id);
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => ExamDto)
    async createExam(@Args('input') input: ExamInput) {
        return this.examService.create(input);
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}