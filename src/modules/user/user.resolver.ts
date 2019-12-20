import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
/* import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlAuthGuard } from '../guards/graphql-auth.guard'; */


@Resolver((of) => UserSchema)
export class UserResolver {

    constructor(private readonly usersService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================
  
    //@UseGuards(GqlAuthGuard)
    @Query(() => UserDto)
    async getUser(@Args('email') email: string) {
        //console.log('Received email: '+email);
        return this.usersService.findByEmail(email);
    }

  // ===========================================================================
  // Mutations
  // ===========================================================================


  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
