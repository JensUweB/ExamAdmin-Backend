import { Field,InputType } from "type-graphql";
import { MartialArtInput } from "./martialArt.input";
import { ExaminerInput } from "./examiner.input";

@InputType()
export class ExamResultInput {
    @Field({ description: '', nullable: true })
    user: string;
    @Field({ description: '', nullable: true })
    exam: string;
    @Field(type => MartialArtInput, { description: '', nullable: true })
    martialArt: MartialArtInput;
    @Field(type => ExaminerInput, { description: '', nullable: true })
    examiner: ExaminerInput;
    @Field({ description: '', nullable: true })
    rank: string;
    @Field({ description: '', nullable: true })
    date: string;
    @Field({ description: '', nullable: true })
    reportUri: string;
    @Field({ description: '', nullable: true })
    passed: boolean;
}