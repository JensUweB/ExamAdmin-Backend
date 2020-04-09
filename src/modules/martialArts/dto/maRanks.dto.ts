import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class SimpleMaRanksDto {
    @Field(() => ID, {nullable: true})
    _id: string;
    @Field({nullable: true})
     rankId: string;
}