import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthModel } from "./auth.model";
import * as bcrypt from 'bcryptjs';
import { UserInput } from "../user/input/user.input";
import { UserService } from "../user/user.service";
import { User as CurrentUser } from "../decorators/user.decorator";
import { UseGuards, NotAcceptableException, InternalServerErrorException } from "@nestjs/common";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { UserDto } from "../user/dto/user.dto";

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
    try{
      const user = await this.authService.validateUser({ email, password });
      return this.authService.login(user);
    } catch (error) { return error; }
  }


  // ===========================================================================
  // Mutations
  // ===========================================================================
  @Mutation(() => Number, { description: 'Creates a new temporary user and sends an confirmation link to the given email address. Returns -1 if account already exists, 1 if you already tried to register and 0 if registration was ok.'})
  async signup(@Args('userInput') userInput: UserInput) {
    try{ return this.authService.signUp(userInput);
    } catch (error) { return error; }
  }

  @Mutation(() => Boolean, {description: 'Send a link for password reset, if the email address is in use. No error message whatsoever.'})
  async forgotPassword(@Args('email') email: string) {
    this.authService.forgotPassword(email);
    return 'We will send a confirmatin email, if this email exists.';
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean, {description: 'Changes the password of the current user.'})
  async changePassword(@CurrentUser() user: any, @Args('password') password: string) {
    try{ return this.authService.changePassword(user.userId, password);
    } catch (error) { return error; }
  }
}