import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthModel } from "./auth.model";
import * as bcrypt from 'bcryptjs';
import { UserInput } from "../user/input/user.input";
import { UserService } from "../user/user.service";
import { User as CurrentUser } from "../decorators/user.decorator";
import { UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";

/**
 * Authentication resolver for the sign in
 */
@Resolver('Auth')
export class AuthResolver {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  // ===========================================================================
  // Queries
  // ===========================================================================
  @Query(() => AuthModel, { description: 'Logs the user in if email and password are correct' })
  async login(@Args('email') email: string, @Args('password') password: string) {
    try {
      const user = await this.authService.validateUser({ email, password });
      return await this.authService.login(user);
    } catch (error) {
      return error;
    }
  }


  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => AuthModel, { description: 'Creates a new User' })
  async signup(@Args('userInput') userInput: UserInput) {
    const emailExists = await this.userService.findByEmail(userInput.email);

    if (emailExists) return Error('Email is already in use');
    // Warning: "No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.""

    const password = await bcrypt.hash(userInput.password, 10);
    const user = await this.userService.create({
      ...userInput,
      password: password
    });

    return this.authService.login(user);
  }

  @Mutation(() => String)
  async forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async changePassword(@CurrentUser() user: any, @Args('password') password: string) {
    return this.authService.changePassword(user.userId, password);
  }
}