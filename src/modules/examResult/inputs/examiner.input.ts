import { Field, InputType } from 'type-graphql';

@InputType()
export class ExaminerInput {
    @Field({ description: 'The user id of the examiner. Just in case we need more information', nullable: true })
    _id: string;
    @Field({ description: 'The first (and middle) name of the examiner', nullable: true })
    firstName: string;
    @Field({ description: 'The last name of the examiner', nullable: true })
    lastName: string;
}