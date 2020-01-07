import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ExaminerDto {
    @Field(type => ID)
    _id: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
}