import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthModel } from "./auth.model";
import { Query } from "@nestjs/common";

/**
 * Authentication resolver for the sign in
 */
@Resolver((of) => AuthModel)
export class AuthResolver {

    constructor(private readonly authService: AuthService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================



// ===========================================================================
// Mutations
// ===========================================================================
    @Mutation(() => AuthModel)
    async login(@Args('email') email: string, @Args('password') password: string) {
      const user = this.authService.validateUser(email, password);
      if(user)
        return this.authService.login(user);
      throw new Error('Invalid Credentials!');
    }

      @Mutation(() => Boolean)
  async validateToken(@Args('token') token: string) {
      return true;
  }
}