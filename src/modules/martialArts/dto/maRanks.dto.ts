import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class SimpleMaRanksDto {
    @Field(() => ID)
    _id: string;
    @Field()
     rankName: string;
    @Field()
     rankNumber: string;
}