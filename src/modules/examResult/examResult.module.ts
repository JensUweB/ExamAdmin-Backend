import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResultSchema } from "./examResult.schema";
import { ExamResultResolver } from "./examResult.resolver";
import { ExamResultService } from "./examResult.service";
import { AuthModule } from "../auth/auth.module";
import { ExamModule } from "../exam/exam.module";
import { MartialArtsModule } from "../martialArts/martialArts.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'ExamResult', schema: ExamResultSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => ExamModule),
        forwardRef(() => MartialArtsModule)
    ],
    providers: [ExamResultResolver, ExamResultService],
    exports: [ExamResultService]
})
export class ExamResultModule {}