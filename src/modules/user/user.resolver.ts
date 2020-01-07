import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
/* import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlAuthGuard } from '../guards/graphql-auth.guard'; */


@Resolver((of) => UserSchema)
export class UserResolver {

    constructor(private readonly userService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================
  
    //@UseGuards(GqlAuthGuard)
    @Query(() => UserDto)
    async getUserByEmail(@Args('email') email: string) {
        return this.userService.findByEmail(email);
    }

    @Query(() => UserDto)
    async getUserById(@Args('id') id: string) {
      return this.userService.findById(id);
    }

  // ===========================================================================
  // Mutations
  // ===========================================================================

  @Mutation(() => UserDto)
  async addClub(@Args('userId') userId: string, @Args('clubId') clubId: string) {
      return this.userService.addClub(userId, clubId);
  }

  @Mutation(() => UserDto)
  async addMartialArtToUser(@Args('userId') userId: string, @Args('rankId') rankId: string) {
    return this.userService.addMartialArtRank(userId, rankId);
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
