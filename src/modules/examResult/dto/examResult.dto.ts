import { ObjectType, Field, ID } from "type-graphql";
import { MartialArtDto } from "./martialArt.dto";
import { ExaminerDto } from "./examiner.dto";

@ObjectType()
export class ExamResultDto {
    @Field(type => ID)
    _id: string;
    @Field()
    user: string;
    @Field()
    exam: string;
    @Field(type => MartialArtDto)
    martialArt: MartialArtDto;
    @Field(type => ExaminerDto)
    examiner: ExaminerDto;
    @Field()
    rank: string;
    @Field()
    date: string;
    @Field()
    reportUri: string;
    @Field()
    passed: boolean;
}