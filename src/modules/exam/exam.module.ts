import { Module, forwardRef } from "@nestjs/common";
import { ExamSchema } from "./exam.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ExamResolver } from "./exam.resolver";
import { ExamService } from "./exam.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Exam', schema: ExamSchema}]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule)
    ],
    providers: [ExamResolver, ExamService],
    exports: [ExamService]
})
export class ExamModule {}