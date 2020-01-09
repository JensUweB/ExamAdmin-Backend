import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResultSchema } from "./examResult.schema";
import { ExamResultResolver } from "./examResult.resolver";
import { ExamResultService } from "./examResult.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'ExamResult', schema: ExamResultSchema}]),
        forwardRef(() => AuthModule)
    ],
    providers: [ExamResultResolver, ExamResultService],
    exports: [ExamResultService]
})
export class ExamResultModule {}