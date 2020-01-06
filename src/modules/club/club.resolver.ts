import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ClubService } from "./club.service";
import { ClubDto } from "./dto/club.dto";
import { ClubInput } from "./inputs/club.input";

@Resolver('Club')
export class ClubResolver {

    constructor(private readonly clubService: ClubService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
   
    @Query(() => [ClubDto])
    async getAllClubs() {
        return this.clubService.findAll();
    }

    @Query(() => ClubDto)
    async getClubById(@Args('id') id: string) {
        return this.clubService.findById(id);
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ClubDto)
    async createClub(@Args('input') input: ClubInput) {
        return this.clubService.create(input);
    }

    @Mutation(() => ClubDto)
    async updateClub(@Args('id') id: string, @Args('input') input: ClubInput) {
        return this.clubService.update(id, input);
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}