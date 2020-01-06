import { Field, InputType } from 'type-graphql';
import { RankInput } from './rank.input';

@InputType()
export class MartialArtsInput {
    @Field({ description: 'The name of the martial art', nullable: false })
    readonly name: string;
    @Field({ description: 'The style name the martial art belongs to', nullable: false })
    readonly styleName: string;
    @Field(type => [RankInput], { description: 'An array of all ranks available in this martial art. The lower the rank number the higher the rank.', nullable: true })
    readonly ranks: RankInput[];
    @Field(type => [String], { description: 'An array of users who is examiner for this martial art. Insert user id.', nullable: true })
    readonly examiners: string[];
}