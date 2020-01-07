import { Module } from "@nestjs/common";
import { ExamSchema } from "./exam.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResolver } from "./exam.resolver";
import { ExamService } from "./exam.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Exam', schema: ExamSchema}])],
    providers: [ExamResolver, ExamService],
    exports: [ExamService]
})
export class ExamModule {}