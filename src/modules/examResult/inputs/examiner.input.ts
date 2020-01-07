import { Field, InputType } from 'type-graphql';

@InputType()
export class ExaminerInput {
    @Field()
    _id: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
}