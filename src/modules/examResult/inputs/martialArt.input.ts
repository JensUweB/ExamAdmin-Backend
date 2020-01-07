import { Field, InputType } from 'type-graphql';

@InputType()
export class MartialArtInput {
    @Field({ description: '', nullable: true })
    _id: string;
    @Field({ description: '', nullable: true })
    name: string;
    @Field({ description: '', nullable: true })
    styleName: string;
}