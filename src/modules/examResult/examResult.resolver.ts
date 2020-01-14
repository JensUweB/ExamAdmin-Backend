import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamResultService } from "./examResult.service";
import { ExamResultDto } from "./dto/examResult.dto";
import { ExamResultInput } from "./inputs/examResult.input";
import { UseGuards } from "@nestjs/common";
import { User as CurrentUser } from "../decorators/user.decorator";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from "fs";
import { Upload } from '../types/Upload';
import { v4 } from 'uuid';
import { pathToFileURL } from "url";
import { ExamService } from "../exam/exam.service";
import * as fs  from 'fs';

@UseGuards(GraphqlAuthGuard)
@Resolver('ExamResult')
export class ExamResultResolver {
    constructor(private readonly erService: ExamResultService, private readonly examService: ExamService) {}
    
    // ===========================================================================
    // Queries
    // ===========================================================================

    @Query(() => [ExamResultDto], {description: 'Returns an array with all exam results of the current user'})
    async getAllExamResults(@CurrentUser() user: any) {
        return this.erService.findAll(user.userId);
    }

    @Query(() => ExamResultDto, {description: 'Returns one exam result with a given id'})
    async getExamResultById(@Args('id') id: string) {
        return this.erService.findById(id);
    }

    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => ExamResultDto, {description: 'Creates a new exam result'})
    async createExamResult(@Args('input') input: ExamResultInput) {
        return this.erService.create(input);
    }

    @Mutation(() => Boolean, {description: 'Delete all exam results related to the current user'})
    async deleteRelatedExamResults(@CurrentUser() user: any) {
        const resultArray = await this.erService.findAll(user.userId);

        for(let i = 0; i < resultArray.length; i++) {
            if(resultArray[i].reportUri && resultArray[i].reportUri != ""){
                fs.unlinkSync(resultArray[i].reportUri.split('///')[1]);
            }
        }

        return this.erService.deleteAllRelated(user.userId);
    }

    @Mutation(()=> Boolean, {description: 'Examiners can upload an exam protocol to an existing exam result. Use cURL request to send required data.'})
    async uploadExamProtocol(@CurrentUser() user: any, @Args({name: 'examResultId', type: () => String}) erId: string,  @Args({name: "protocol", type: () => GraphQLUpload}) { createReadStream, filename }: Upload): Promise<boolean> {
        // Checks if the sending user is equal to the examiner
        if(!erId) return false;
        const examResult = await this.erService.findById( erId);
        if(!examResult) return false;
        const exam = await this.examService.findById(examResult.exam);
        if(!exam) return false;
        if(exam.examiner.toString() != user.userId) return false;

        // Deletes file if some already exist
        if(examResult.reportUri) fs.unlinkSync(examResult.reportUri.split('///')[1]);        

        // Create an new unique file name
        const id = v4();
        const fileArray = filename.split('.');
        const fileEnd = fileArray[fileArray.length-1];
        const newfilename = id + '.' + fileEnd.toLocaleLowerCase();
        const relativePath = __dirname + `/../../uploads/protocols/${newfilename}`;
        
        // Add the file uri to the exam result
        this.erService.addReportUri(erId,pathToFileURL(relativePath).toString());

        return new Promise(async (resolve, reject) => 
            createReadStream()
            .pipe(createWriteStream(relativePath))
            .on('finish', result => {
                resolve(true);
            })
            .on('error', () => reject(false))
        );
        
    } 
    // ===========================================================================
    // Subscriptions
    // ===========================================================================
}
 