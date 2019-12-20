import { InputType, Field } from "type-graphql";

@InputType()
export class RankInput {
        @Field()    
        public rankName: string; 
        @Field()
        public rankNumber: number;
}