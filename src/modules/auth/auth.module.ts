import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from "@nestjs/jwt";
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
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: process.env.JWT_EXPIRE}
        }),
    ],
    providers: [AuthService, MailerService, JwtStrategy, AuthResolver, GraphqlAuthGuard],
    exports: [AuthService, MailerService, JwtModule, GraphqlAuthGuard]
})
export class AuthModule {

}