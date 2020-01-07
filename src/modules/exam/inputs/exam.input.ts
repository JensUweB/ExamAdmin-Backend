import { InputType, Field } from "type-graphql";

@InputType()
export class ExamInput {
    @Field({ description: 'The title of the exam', nullable: false })
    readonly title: string;
    @Field({ description: 'The description of the exam', nullable: false })
    readonly description: string;
    @Field({ description: 'The date when the exam should be held', nullable: false })
    readonly  examDate: Date;
    @Field({ description: 'The date when registration will be closed', nullable: false })
    readonly  regEndDate: Date;
    @Field({ description: 'The id of the accompanying association / club', nullable: false })
    readonly  club: string;
    @Field({ description: 'The user id of the examiner', nullable: false })
    readonly  examiner: string;
    @Field({ description: 'The id of the martial art this exam is for', nullable: false })
    readonly  martialArt: string;
    @Field(type => [String], { description: 'An array of ids from users who wants to get examined ', nullable: false })
    readonly  participants: string[];
}