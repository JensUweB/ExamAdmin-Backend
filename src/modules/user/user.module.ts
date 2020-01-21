import { Module, forwardRef } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.schema';
import { UserService } from "./user.service";
import { MartialArtsModule } from "../martialArts/martialArts.module";
import { ClubModule } from "../club/club.module";
import { AuthModule } from "../auth/auth.module";
import { TmpUserSchema } from "./tmpUser.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}, {name: 'TmpUser', schema: TmpUserSchema}]),
        MartialArtsModule,
        forwardRef(() => ClubModule),
        forwardRef(() => AuthModule)
    ],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule {}