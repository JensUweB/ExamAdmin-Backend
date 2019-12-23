import { InputType, Field, ID } from "type-graphql";

@InputType()
export class ExaminerInput {
        @Field(() => ID)    
        public _id: string;
}