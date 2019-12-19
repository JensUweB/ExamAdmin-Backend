import { Field, InputType } from 'type-graphql';

@InputType()
export class MartialArtsInput {
    @Field()
    readonly name: string;
    @Field()
    readonly stylename: string;
    @Field()
    readonly ranks: [{rankName: String, rankNumber: Number}]
    @Field()
    readonly examiners: [{userId: String}] 
}