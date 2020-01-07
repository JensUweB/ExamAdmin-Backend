import { Field,InputType } from "type-graphql";
import { MartialArtInput } from "./martialArt.input";
import { ExaminerInput } from "./examiner.input";

@InputType()
export class ExamResultInput {
    @Field()
    user: string;
    @Field()
    exam: string;
    @Field(type => MartialArtInput)
    martialArt: MartialArtInput;
    @Field(type => ExaminerInput)
    examiner: ExaminerInput;
    @Field()
    rank: string;
    @Field()
    date: string;
    @Field()
    reportUri: string;
    @Field()
    passed: boolean;
}