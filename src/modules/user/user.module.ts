import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { MartialArtsModule } from "../martialArts/martialArts.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MartialArtsModule
    ],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule {}