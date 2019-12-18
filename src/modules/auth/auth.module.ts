import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { LocalStrategy } from './local.strategy';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/user.schema";

@Module({
    imports: [
        UserModule, 
        PassportModule, 
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '60s'}
        }),
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService]
})
export class AuthModule {

}