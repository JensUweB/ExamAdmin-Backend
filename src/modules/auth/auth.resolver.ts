import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthModel } from "./auth.model";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { UserInput } from "../user/input/user.input";
import { UserService } from "../user/user.service";

/**
 * Authentication resolver for the sign in
 */
@Resolver('Auth') //(of) => AuthModel
export class AuthResolver {

    constructor(
      private readonly authService: AuthService,
      private readonly jwt: JwtService,
      private readonly userService: UserService
    ) {}

// ===========================================================================
// Queries
// ===========================================================================



// ===========================================================================
// Mutations
// ===========================================================================
    @Mutation(() => AuthModel)
    async login(@Args('email') email: string, @Args('password') password: string) {
      try{
        const user = this.authService.validateUser({email, password});
        return this.authService.login(user);
      } catch (error) {
        throw error;
      }
    }

    @Mutation(() => AuthModel)
    async signup(@Args('userInput') userInput: UserInput) {
        const emailExists = await this.userService.findByEmail(userInput.email);

        if(emailExists) throw Error('Email is already in use');
        // Warning: "No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.""

        const password = await bcrypt.hash(userInput.password, 10);
        const user = await this.userService.create({
          ...userInput,
          password: password
        });

        return this.authService.login(user);
    }
}