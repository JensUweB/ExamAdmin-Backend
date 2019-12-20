import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class RankModel {
        @Field()    
        public rankName: string; 
        @Field()
        public rankNumber: number;
}