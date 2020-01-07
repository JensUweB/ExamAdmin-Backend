import { Field, InputType } from 'type-graphql';

@InputType()
export class ExaminerInput {
    @Field({ description: '', nullable: true })
    _id: string;
    @Field({ description: '', nullable: true })
    firstName: string;
    @Field({ description: '', nullable: true })
    lastName: string;
}