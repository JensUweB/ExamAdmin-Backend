import { ObjectType, Field, ID } from "type-graphql";

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class ExamDto {
    @Field(type => ID)
    _id: string;
    @Field()
     title: string;
    @Field()
    description: string;
    @Field()
    examDate: Date;
    @Field()
    regEndDate: Date;
    @Field()
    club: string;
    @Field()
    examiner: string;
    @Field()
    martialArt: string;
    @Field(type => [String])
    participants: string[];
}