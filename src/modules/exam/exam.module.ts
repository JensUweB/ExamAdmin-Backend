import { Module, forwardRef } from "@nestjs/common";
import { ExamSchema } from "./exam.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResolver } from "./exam.resolver";
import { ExamService } from "./exam.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { MartialArtsModule } from "../martialArts/martialArts.module";
import { ClubModule } from "../club/club.module";
import { MartialArtSchema } from "../martialArts/martialArts.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Exam', schema: ExamSchema},{name: 'MartialArts', schema: MartialArtSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => MartialArtsModule),
        forwardRef(() => ClubModule)
    ],
    providers: [ExamResolver, ExamService],
    exports: [ExamService]
})
export class ExamModule {}