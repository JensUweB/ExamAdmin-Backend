import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UseGuards, NotFoundException, Req } from "@nestjs/common";
import { GqlAuthGuard } from '../guards/graphql-auth.guard';
import { AuthGuard } from "../guards/auth.guard";
import { ExecutionContext } from "graphql/execution/execute";


@UseGuards(AuthGuard)
@Resolver((of) => UserSchema)
export class UserResolver {

    constructor(private readonly userService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================
  
    
    @Query(() => UserDto, {description: 'Searches for a user by a given email'})
    async getUserByEmail(@Args('email') email: string) {
        const result = await this.userService.findByEmail(email);
        if(result) return result;
        return new NotFoundException('User not found!');
    }
    @Query(() => UserDto, {description: 'Searchs for a user by a given id'})
    async getUserById(@Args('id') id: string) {
      const result = await this.userService.findById(id);
      if(result) return result;
      return new NotFoundException('User not found!');
    }

  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => UserDto, {description: 'Add a new club to the clubs array of a user'})
  async addClub(@Args('userId') userId: string, @Args('clubId') clubId: string) {
      const result = await this.userService.addClub(userId, clubId);
      if(result) return result;
      return new NotFoundException('User not found!');
  }
  @Mutation(() => UserDto, {description: 'Add a new martial art rank to a user'})
  async addMartialArtRankToUser(@Args('userId') userId: string, @Args('rankId') rankId: string) {
    const result = await this.userService.addMartialArtRank(userId, rankId);
    if(result) return result;
    return new NotFoundException('User not found!');
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string){
    return this.userService.deleteUser(id);
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
