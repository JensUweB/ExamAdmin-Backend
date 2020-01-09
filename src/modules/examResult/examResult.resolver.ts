import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamResultService } from "./examResult.service";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";

@UseGuards(AuthGuard)
@Resolver('ExamResult')
export class ExamResultResolver {
    constructor(private readonly erService: ExamResultService) {}
    
    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [ExamResultDto], {description: 'Returns an array with all exam results of a given user'})
    async getAllExamResults(@Args('userId') userId: string) {
        return this.erService.findAll(userId);
    }

    @Query(() => ExamResultDto, {description: 'Returns one exam result with a given id'})
    async getExamResultById(@Args('id') id: string) {
        return this.erService.findById(id);
    }

    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ExamResultDto, {description: 'Creates a new exam result'})
    async createExamResult(@Args('input') input: ExamResultInput) {
        return this.erService.create(input);
    }
    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}