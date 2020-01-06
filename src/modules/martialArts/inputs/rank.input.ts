import { InputType, Field } from "type-graphql";

@InputType()
export class RankInput {
        @Field()    
        public name: string; 
        @Field()
        public number: number;
}