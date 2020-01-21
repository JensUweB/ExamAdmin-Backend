import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ClubService } from "./club.service";
import { ClubDto } from "./dto/club.dto";
import { ClubInput } from "./inputs/club.input";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { User as CurrentUser } from "../decorators/user.decorator";

@UseGuards(GraphqlAuthGuard)
@Resolver('Club')
export class ClubResolver {

    constructor(private readonly clubService: ClubService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
   
    @Query(() => [ClubDto], {description: 'Returns an array with all existing clubs'})
    async getAllClubs() {
        const result = await this.clubService.findAll();
        if(result) return result;
        return new Error('No club found. Please create a club first bevore searching.');
    }

    @Query(() => ClubDto, {description: 'Returns one club by id'})
    async getClubById(@Args('id') id: string) {
        const result = await this.clubService.findById(id);
        if(result) return result;
        return new NotFoundException('Club not found!');
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
        const result = await this.clubService.update(id, input);
        if(result) return result;
        return new NotFoundException('Club not found!');
    }

    @Mutation(() => String)
    async deleteClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
        const res = await this.clubService.delete(user.userId, clubId);
        switch(res){
            case 1: {return 'Success';}
            case 0: {return 'Error: delete club failed';}
            case -1: {return 'Error: club not found';}
            case -2: {return 'Error: Not authorized to delete this club';}
            default: {return 'Unexpected Server Error';}
        }
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}