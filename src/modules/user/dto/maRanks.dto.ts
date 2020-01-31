import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class MaRanksDto {
    @Field(() => ID)
    _id: string;
    @Field()
     rankName: string;
    @Field()
     rankNumber: string;
}