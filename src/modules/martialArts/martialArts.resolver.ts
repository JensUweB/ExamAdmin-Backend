import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { RanksDto } from "./dto/ranks.dto";

@Resolver('MartialArts')
export class MartialArtsResolver {

    constructor(private readonly maService: MartialArtsService) { }

    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [MartialArtsDto])
    async getAllMartialArts() {
        return this.maService.findAll();
    }

    @Query(() => MartialArtsDto)
    async getMartialArtById(@Args('id') id: string) {
        return this.maService.findById(id);
    }

    @Query(() => MartialArtsDto)
    async getMartialArtByRank(@Args('rankId') rankId: string) {
        return this.maService.findByRank(rankId);
    }

    @Query(() => RanksDto)
    async getRank(@Args('rankId') rankId: string) {
        return this.maService.findRank(rankId);
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => MartialArtsDto)
    async createMartialArt(@Args('input') input: MartialArtsInput) {
        return this.maService.create(input);
    }

    @Mutation(() => MartialArtsDto)
    async updateMartialArt(@Args('id') id: string, @Args('input') input: MartialArtsInput) {
        return this.maService.update(id, input);
    }

    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}