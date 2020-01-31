import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class MaRanksInput {
    @Field(() => ID,{ description: 'The id of the martial art', nullable: false })
    _id: string;
    @Field({ description: 'The name of the rank', nullable: true })
     rankName: string;
    @Field({ description: 'The number of the rank', nullable: true })
     rankNumber: number;
}