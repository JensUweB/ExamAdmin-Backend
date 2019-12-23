import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class RanksDto {
        @Field(type => ID)
        _id: string;
        @Field()    
        public rankName: string; 
        @Field()
        public rankNumber: number;
}