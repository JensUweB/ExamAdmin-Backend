import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ClubService } from "./club.service";
import { ClubDto } from "./dto/club.dto";
import { ClubInput } from "./inputs/club.input";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { User as CurrentUser } from "../decorators/user.decorator";
import { UserDto } from "../user/dto/user.dto";

@UseGuards(GraphqlAuthGuard)
@Resolver('Club')
export class ClubResolver {

    constructor(private readonly clubService: ClubService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
   
    @Query(() => [ClubDto], {description: 'Returns an array with all existing clubs'})
    async getAllClubs() {
        try { return this.clubService.findAll();
        } catch (error) { return error; }
    }

    @Query(() => ClubDto, {description: 'Returns one club by id'})
    async getClubById(@Args('id') id: string) {
        try { return  this.clubService.findById(id);
        } catch (error) { return error; }
    }

    @Query(() => [UserDto], {description: 'Returns an array of all club members, if the current user is authorized'})
    async getAllClubMembers(@CurrentUser() user: any, @Args('clubId')clubId: string) {
        try { return this.clubService.getAllMembers(user.userId, clubId);
        } catch (error) { return error; }
    }


    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ClubDto, {description: 'Create a new club.'})
    async createClub(@Args('input') input: ClubInput) {
        try { return this.clubService.create(input);
        } catch (error) { return error; }
    }

    @Mutation(() => Boolean, {description: 'Adds a new admin to a club, if the current user is authorized'})
    async addClubAdmin(@CurrentUser() user: any, @Args('clubId') clubId: string, @Args('userId') userId: string) {
        try { return this.clubService.addAdmin(clubId, userId, user.userId);
        } catch (error) { return error; }
    }

    @Mutation(() => ClubDto, {description: 'Update an existinc club. Just fill out what you want to change!'})
    async updateClub(@Args('id') id: string, @Args('input') input: ClubInput) {
        try { return  this.clubService.update(id, input);
        } catch (error) { return error; }
    }

    @Mutation(() => Boolean, {description: 'Deletes a club, if the current user is authorized'})
    async deleteClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
        try { return this.clubService.delete(user.userId, clubId);
        } catch (error) { return error; }
    }


    // ===========================================================================
    // Subscriptions
    // ===========================================================================


}