import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ExamInput {
    @Field({ description: 'The title of the exam', nullable: true })
    readonly title: string;
    @Field({ description: 'The description of the exam', nullable: true })
    readonly description: string;
    @Field({ description: 'The price - how much this exam will cost.', nullable: true })
    readonly price: string;
    @Field({ description: 'The description of the exam', nullable: true })
    readonly examPlace: string;
    @Field({ description: 'The date when the exam should be held', nullable: true })
    readonly  examDate: Date;
    @Field({ description: 'The date when registration will be closed', nullable: true })
    readonly  regEndDate: Date;
    @Field({ description: 'Is this exam open for public registration?', nullable: true })
    readonly  isPublic: boolean;
    @Field({ description: 'The id of the accompanying association / club', nullable: true })
    readonly  club: string;
    @Field({nullable: true})
    readonly minRank: string;
    @Field({ description: 'The user id of the examiner', nullable: true })
    readonly  examiner: string;
    @Field({ description: 'The id of the martial art this exam is for', nullable: true })
    readonly  martialArt: string;
    @Field(type => [String], { description: 'An array of ids from users who wants to get examined ', nullable: true })
    readonly  participants: string[];
}