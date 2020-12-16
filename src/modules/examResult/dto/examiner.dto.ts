import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExaminerDto {
    @Field(type => ID)
    _id: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
}