import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClubSchema } from "./club.schema";
import { ClubResolver } from "./club.resolver";
import { ClubService } from "./club.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Club', schema: ClubSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule)
    ],
    providers: [ClubResolver, ClubService],
    exports: [ClubService]
})
export class ClubModule {}