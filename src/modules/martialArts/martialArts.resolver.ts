import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MartialArts } from "./interfaces/martialArts.interface";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { MartialArtsInput } from "./inputs/martialArts.input";

@Resolver('MartialArts')
export class MartialArtsResolver {

    constructor(private readonly maService: MartialArtsService) { }

    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [MartialArtsDto])
    async getAllMartialArts(): Promise<MartialArtsDto[]> {
        return this.maService.findAll();
    }

    @Mutation(() => MartialArtsDto)
    async getMartialArtsById(@Args('id') id: string): Promise<MartialArts> {
        return this.maService.findById(id);
    }

    // ===========================================================================
    // Mutations
    // ===========================================================================

    @Mutation(() => MartialArtsDto)
    async createMartialArt(@Args('input') input: MartialArtsInput): Promise<MartialArts> {
        return this.maService.create(input);
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================



}