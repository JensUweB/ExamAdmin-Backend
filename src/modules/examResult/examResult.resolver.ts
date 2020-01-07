import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamResultService } from "./examResult.service";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";

@Resolver('ExamResult')
export class ExamResultResolver {
    constructor(private readonly erService: ExamResultService) {}
    
    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [ExamResultDto])
    async getAllExamResults(@Args('userId') userId: string) {
        return this.erService.findAll(userId);
    }

    @Query(() => ExamResultDto)
    async getExamResultById(@Args('id') id: string) {
        return this.erService.findById(id);
    }

    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ExamResultDto)
    async createExamResult(@Args('input') input: ExamResultInput) {
        return this.erService.create(input);
    }
    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}