import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RankDto {
        @Field(type => ID)
        _id: string;
        @Field()
         name: string;
        @Field()
         number: number;
}