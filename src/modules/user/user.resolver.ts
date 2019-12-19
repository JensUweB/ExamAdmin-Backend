import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserInput } from "./input/user.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Resolver((of) => UserSchema)
export class UserResolver {

    constructor(private readonly usersService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================
  
    @UseGuards(AuthGuard('jwt'))
    @Query(() => CreateUserDto)
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
