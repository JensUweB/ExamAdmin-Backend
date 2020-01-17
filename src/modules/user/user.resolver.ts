import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UseGuards, NotFoundException, Req } from "@nestjs/common";
import { User as CurrentUser } from "../decorators/user.decorator";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";


@UseGuards(GraphqlAuthGuard)
@Resolver('User')
export class UserResolver {

  constructor(private readonly userService: UserService) { }

  // ===========================================================================
  // Queries
  // ===========================================================================

  @Query(() => UserDto, { description: 'Returns an user object representing the current logged in user' })
  async getUser(@CurrentUser() user: any) {
    const result = await this.userService.findById(user.userId);
    if (result) return result;
    return new NotFoundException('User not found!');
  }

  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => UserDto, { description: 'Add a new club to the clubs array of a user' })
  async addUserToClub(@CurrentUser() user: any, @Args('clubId') clubId: string) {
    const result = await this.userService.addClub(user.userId, clubId);
    if (result) return result;
    return new NotFoundException('Club not found!');
  }
  
  @Mutation(() => UserDto, { description: 'Add a new martial art rank to the current user' })
  async addMartialArtRankToUser(@CurrentUser() user: any, @Args('rankId') rankId: string) {
    const result = await this.userService.addMartialArtRank(user.userId, rankId);
    if (result) return result;
    return new NotFoundException('User not found!');
  }

  @Mutation(() => Boolean, {description: 'Deletes the account of the current user'})
  async deleteUser(@CurrentUser() user: any) {
    return this.userService.deleteUser(user.userId);
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
