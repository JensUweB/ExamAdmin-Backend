import { Field, InputType } from 'type-graphql';
import { RankModel } from '../ranks.model';
import { RankInput } from './rank.input';
import { ExaminerInput } from './examiner.input';

@InputType()
export class MartialArtsInput {
    @Field({ description: 'The name of the martial art', nullable: false })
    readonly name: string;
    @Field({ description: 'The style name the martial art belongs to', nullable: false })
    readonly styleName: string;
    @Field(type => [RankInput])
    readonly ranks: RankInput[];
    @Field(type => [String])
    readonly examiners: string[];
}