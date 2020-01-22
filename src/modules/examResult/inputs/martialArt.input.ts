import { Field, InputType } from 'type-graphql';

@InputType()
export class MartialArtInput {
    @Field({ description: 'The id of the martial art that the exam was about. Just in case we need more information.', nullable: true })
    _id: string;
    @Field({ description: 'The name of the martial art', nullable: true })
    name: string;
    @Field({ description: 'The style name of the martial art', nullable: true })
    styleName: string;
}