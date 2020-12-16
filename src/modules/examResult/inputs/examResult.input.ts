import { Field, InputType } from '@nestjs/graphql';
import { MartialArtInput } from './martialArt.input';
import { ExaminerInput } from './examiner.input';

@InputType()
export class ExamResultInput {
    @Field({ description: 'The id of the user this exam result is all about.', nullable: true })
    user: string;
    @Field({ description: 'The id of the related exam', nullable: true })
    exam: string;
    @Field(type => MartialArtInput, { description: 'The martial art that was testet', nullable: true })
    martialArt: MartialArtInput;
    @Field(type => ExaminerInput, { description: 'The examiner of the exam', nullable: true })
    examiner: ExaminerInput;
    @Field({ description: 'The name of the rank that the user achieved', nullable: true })
    rank: string;
    @Field({ description: 'The date string this exam took place', nullable: true })
    date: string;
    @Field({ description: 'Did the user passed the exam? False, if he failed.', nullable: true })
    passed: boolean;
}