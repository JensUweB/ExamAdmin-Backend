import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { RankDto } from "./dto/rank.dto";
import { UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { User as CurrentUser } from "../decorators/user.decorator";


@UseGuards(GraphqlAuthGuard)
@Resolver('MartialArts')
export class MartialArtsResolver {

    constructor(private readonly maService: MartialArtsService) { }

    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [MartialArtsDto], {description: 'Returns an array of martial art objects'})
    async getAllMartialArts() {
        return this.maService.findAll();
    }

    @Query(() => MartialArtsDto, {description: 'Returns one martial art object by id'})
    async getMartialArtById(@Args('id') id: string) {
        return this.maService.findById(id);
    }

    @Query(() => MartialArtsDto, {description: 'Returns one martial art object by rank id'})
    async getMartialArtByRank(@Args('rankId') rankId: string) {
        return this.maService.findByRank(rankId);
    }

    @Query(() => RankDto, {description: 'Returns striped out one rank object by rank id'})
    async getRank(@Args('rankId') rankId: string) {
        return this.maService.findRank(rankId);
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => MartialArtsDto, {description: 'Creates a new martial art'})
    async createMartialArt(@Args('input') input: MartialArtsInput) {
        return this.maService.create(input);
    }

    @Mutation(() => MartialArtsDto, {description: 'Updates an existing martial art'})
    async updateMartialArt(@Args('id') id: string, @Args('input') input: MartialArtsInput) {
        return this.maService.update(id, input);
    }

    @Mutation(() => String)
    async deleteMartialArt(@CurrentUser() user: any, martialArtId: string) {
        const res = await this.maService.delete(user.userId, martialArtId);
        switch(res){
            case 1: {return 'Success';}
            case 0: {return 'Error: delete martial art failed';}
            case -1: {return 'Error: martial art not found';}
            case -2: {return 'Error: Not authorized to delete this martial art';}
            default: {return 'Unexpected Server Error';}
        }
    }

    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}