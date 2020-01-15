import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { AuthResolver } from "./auth.resolver";
import { MailerService } from "./mailer.service";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";

@Module({
    imports: [
        forwardRef(() => UserModule) , 
        PassportModule.register({
            defaultStrategy: 'jwt'
        }), 
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: 3600}
        }),
    ],
    providers: [AuthService, MailerService, JwtStrategy, AuthResolver, GraphqlAuthGuard],
    exports: [AuthService, MailerService, JwtModule, GraphqlAuthGuard]
})
export class AuthModule {

}