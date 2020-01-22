import { ObjectType, Field, ID } from "type-graphql";

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class ExamDto {
    @Field(type => ID)
    _id: string;
    @Field({ description: 'The title of the exam', nullable: false })
     title: string;
    @Field({ description: 'Describe what tis exam is all about', nullable: false })
    description: string;
    @Field({ description: 'The date and time of the exam', nullable: false })
    examDate: Date;
    @Field({ description: 'The date and time when registration should close', nullable: false })
    regEndDate: Date;
    @Field({ description: 'The id of the club who organizes this exam', nullable: false })
    club: string;
    @Field({ description: 'The id of the responsible examiner. Usually the current user.', nullable: false })
    examiner: string;
    @Field({ description: 'The martial art that gets tested', nullable: false })
    martialArt: string;
    @Field(type => [String], { description: 'An array with IDs from users who wants to get tested', nullable: false })
    participants: string[];
}