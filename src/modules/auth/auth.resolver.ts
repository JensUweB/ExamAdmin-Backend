import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthModel } from "./auth.model";

/**
 * Authentication resolver for the sign in
 */
@Resolver((of) => AuthModel)
export class AuthResolver {

    constructor(private readonly authService: AuthService) {}

// ===========================================================================
// Mutations
// ===========================================================================
    @Mutation(() => AuthModel)
    async login(@Args('email') email: string, @Args('password') password: string) {
       const user = this.authService.validateUser(email, password);
       return this.authService.login(user);
    }
}