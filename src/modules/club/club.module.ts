import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClubSchema } from "./club.schema";
import { ClubResolver } from "./club.resolver";
import { ClubService } from "./club.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Club', schema: ClubSchema}])],
    providers: [ClubResolver, ClubService],
    exports: [ClubService]
})
export class ClubModule {}