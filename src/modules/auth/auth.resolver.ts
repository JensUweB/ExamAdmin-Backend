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
  @Mutation(() => UserDto, { description: 'Creates a new temporary user and sends an confirmation link to the given email address.'})
  async signup(@Args('userInput') userInput: UserInput) {
    try{
      await this.userService.findByEmail(userInput.email);          // Throws an NotFoundException, if email address is not found.
      return new NotAcceptableException('Email is already in use'); // We got no Exception, that means email address is already in use.
    } catch (error) {                                               // userService has thrown an NotFoundException, so email adress is not yet in use.
      const password = await bcrypt.hash(userInput.password, 10);
      return this.userService.create({
        ...userInput,
        password: password
      });
    }
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