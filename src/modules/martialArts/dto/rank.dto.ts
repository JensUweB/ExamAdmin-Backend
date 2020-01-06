import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class RankDto {
        @Field(type => ID)
        _id: string;
        @Field()    
        public name: string; 
        @Field()
        public number: number;
}