import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";import { CreateUserDto } from "./dto/create-user.dto";
import { UserInput } from "./input/user.input";


@Resolver((of) => UserSchema)
export class UserResolver {

    constructor(private readonly usersService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

    @Query(() => String)
    async getUser() {
        return 'Hello World!';
    }

    @Query(() => [CreateUserDto])
    async getUsers() {
        return this.usersService.findAll();
    }

  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => CreateUserDto)
  async createUser(@Args('input') input: UserInput) {
      return this.usersService.create(input);
  }


  // ===========================================================================
  // Subscriptions
  // ===========================================================================
}
