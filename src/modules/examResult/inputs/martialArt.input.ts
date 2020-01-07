import { Field, InputType } from 'type-graphql';

@InputType()
export class MartialArtInput {
    @Field()
    _id: string;
    @Field()
    name: string;
    @Field()
    styleName: string;
}