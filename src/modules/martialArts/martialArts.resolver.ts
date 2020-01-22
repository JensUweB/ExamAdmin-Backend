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
        try{ return this.maService.findAll();
        } catch (error) { return error; }
    }

    @Query(() => MartialArtsDto, {description: 'Returns one martial art object by id'})
    async getMartialArtById(@Args('id') id: string) {
        try{ return this.maService.findById(id);
        } catch (error) { return error; }
    }

    @Query(() => MartialArtsDto, {description: 'Returns one martial art object by rank id'})
    async getMartialArtByRank(@Args('rankId') rankId: string) {
        try{ return this.maService.findByRank(rankId);
        } catch (error) { return error; }
    }

    @Query(() => RankDto, {description: 'Returns striped out one rank object by rank id'})
    async getRank(@Args('rankId') rankId: string) {
        try{ return this.maService.findRank(rankId);
        } catch (error) { return error; }
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => MartialArtsDto, {description: 'Creates a new martial art'})
    async createMartialArt(@Args('input') input: MartialArtsInput) {
        try{ return this.maService.create(input);
        } catch (error) { return error; }
    }

    @Mutation(() => MartialArtsDto, {description: 'Updates an existing martial art'})
    async updateMartialArt(@Args('id') id: string, @Args('input') input: MartialArtsInput) {
        try{ return this.maService.update(id, input);
        } catch (error) { return error; }
    }

    @Mutation(() => String, {description: 'Deletes a martial art, if the current user is authorized'})
    async deleteMartialArt(@CurrentUser() user: any, @Args('id') id: string) {
        try{ return this.maService.delete(user.userId, id);
        } catch (error) { return error; }
    }

    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}