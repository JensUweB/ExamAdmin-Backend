import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamResultService } from "./examResult.service";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";
import { UseGuards } from "@nestjs/common";
import { User as CurrentUser } from "../decorators/user.decorator";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";

@UseGuards(GraphqlAuthGuard)
@Resolver('ExamResult')
export class ExamResultResolver {
    constructor(private readonly erService: ExamResultService) {}
    
    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [ExamResultDto], {description: 'Returns an array with all exam results of the current user'})
    async getAllExamResults(@CurrentUser() user: any) {
        return this.erService.findAll(user.userId);
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

    @Mutation(() => Boolean, {description: 'Delete all exam results related to the current user'})
    async deleteRelatedExamResults(@CurrentUser() user: any) {
        return this.erService.deleteAllRelated(user.userId);
    }
    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}