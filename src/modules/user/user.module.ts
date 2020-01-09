import { Module, forwardRef } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { MartialArtsModule } from "../martialArts/martialArts.module";
import { MartialArtsService } from "../martialArts/martialArts.Service";
import { ClubModule } from "../club/club.module";
import { ClubService } from "../club/club.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MartialArtsModule,
        ClubModule,
        forwardRef(() => AuthModule) 
    ],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule {}