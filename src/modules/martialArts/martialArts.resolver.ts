import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { RankDto } from "./dto/rank.dto";

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

    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}