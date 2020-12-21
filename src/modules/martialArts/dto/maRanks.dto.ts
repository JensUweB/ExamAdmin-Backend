import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SimpleMaRanksDto {
    @Field(() => ID, {nullable: true})
    _id: string;
    @Field({nullable: true})
     rankId: string;
}