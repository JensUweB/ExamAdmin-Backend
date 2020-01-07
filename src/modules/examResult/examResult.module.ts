import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResultSchema } from "./examResult.schema";
import { ExamResultResolver } from "./examResult.resolver";
import { ExamResultService } from "./examResult.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'ExamResult', schema: ExamResultSchema}])],
    providers: [ExamResultResolver, ExamResultService],
    exports: [ExamResultService]
})
export class ExamResultModule {}