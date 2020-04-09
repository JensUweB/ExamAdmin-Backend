import { ObjectType, Field, ID } from "type-graphql";
import { MartialArtsDto } from "../../martialArts/dto/martialArts.dto";
import { ClubDto } from "../../club/dto/club.dto";
import { UserDto } from "../../user/dto/user.dto";

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
    @Field({ description: 'The price - how much this exam will cost.', nullable: false })
    price: string;
    @Field({ description: 'The date and time of the exam', nullable: false })
    examDate: Date;
    @Field({ description: 'The date and time when registration should close', nullable: false })
    regEndDate: Date;
    @Field({ description: 'Is this exam public, or only for club members?', nullable: false })
    isPublic: boolean;
    @Field({ description: 'The id of the club who organizes this exam', nullable: false })
    club: ClubDto;
    @Field({ description: 'The id of the responsible examiner. Usually the current user.', nullable: false })
    examiner: UserDto;
    @Field({ description: 'The adress where the exam will take place', nullable: false })
     examPlace: string;
    @Field({ description: 'The martial art that gets tested', nullable: false })
    martialArt: MartialArtsDto;
    @Field(type => [UserDto], { description: 'An array with IDs from users who wants to get tested', nullable: false })
    participants: UserDto[];
}