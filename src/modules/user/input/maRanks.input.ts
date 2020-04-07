import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class MaRanksInput {
    @Field(() => String,{ description: 'The id of the martial art', nullable: false })
    _id: string;
    @Field({ description: 'The id of the rank', nullable: true })
     rankId: string;
}