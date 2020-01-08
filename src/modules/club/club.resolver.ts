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
   
    @Query(() => [ClubDto], {description: 'Returns an array with all existing clubs'})
    async getAllClubs() {
        return this.clubService.findAll();
    }

    @Query(() => ClubDto, {description: 'Returns one club by id'})
    async getClubById(@Args('id') id: string) {
        return this.clubService.findById(id);
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ClubDto, {description: 'Create a new club.'})
    async createClub(@Args('input') input: ClubInput) {
        return this.clubService.create(input);
    }

    @Mutation(() => ClubDto, {description: 'Update an existinc club. Just fill out what you want to change!'})
    async updateClub(@Args('id') id: string, @Args('input') input: ClubInput) {
        return this.clubService.update(id, input);
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}