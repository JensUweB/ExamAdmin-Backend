import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UseGuards, } from "@nestjs/common";
import { User as CurrentUser } from "../decorators/user.decorator";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { UserInput } from "./input/user.input";


@UseGuards(GraphqlAuthGuard)
@Resolver('User')
export class UserResolver {

  constructor(private readonly userService: UserService) { }

  // ===========================================================================
  // Queries
  // ===========================================================================

  @Query(() => UserDto, { description: 'Returns an user object representing the current logged in user' })
  async getUser(@CurrentUser() user: any) {
    return this.userService.findById(user.userId);
  }

  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => UserDto, { description: 'Add a new club to the clubs array of a user' })
  async addUserToClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
    try{ return this.userService.addClub(user.userId, clubId);
    } catch (error) { return error; }
  }

  @Mutation(() => Boolean, {description: 'Removes the current user from a club member list'})
  async removeUserFromClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
    try{ return this.userService.removeClub(user.userId, clubId);
    } catch (error) { return error; }
  }
  
  @Mutation(() => UserDto, { description: 'Add a new martial art rank to the current user' })
  async addMartialArtRankToUser(@CurrentUser() user: any, @Args('rankId') rankId: string) {
    try{ return this.userService.addMartialArtRank(user.userId, rankId);
    } catch (error) { return error; }
  }

  @Mutation(() => UserDto, {description: 'Updates the current user'})
  async updateUser(@CurrentUser() user: any, @Args('input') input: UserInput) {
    try{
      return this.userService.update(user._id, input);
    } catch (error) { return error; }
  }

  @Mutation(() => Boolean, {description: 'Deletes the account of the current user'})
  async deleteUser(@CurrentUser() user: any) {
    try{ return this.userService.deleteUser(user.userId);
    } catch (error) { return error; }
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
