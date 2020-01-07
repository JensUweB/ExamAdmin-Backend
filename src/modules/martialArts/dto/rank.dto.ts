import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class RankDto {
        @Field(type => ID)
        _id: string;
        @Field()    
         name: string; 
        @Field()
         number: number;
}