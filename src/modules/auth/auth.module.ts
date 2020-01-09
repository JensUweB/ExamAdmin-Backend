import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/user.schema";
import { AuthResolver } from "./auth.resolver";

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
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    providers: [AuthService, JwtStrategy, AuthResolver],
    exports: [AuthService]
})
export class AuthModule {

}