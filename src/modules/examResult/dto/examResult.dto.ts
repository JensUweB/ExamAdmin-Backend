import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MartialArtsDto } from '../../martialArts/dto/martialArts.dto';
import { UserDto } from './../../user/dto/user.dto';

@ObjectType()
export class ExamResultDto {
    @Field(type => ID)
    _id: string;
    @Field()
    user: string;
    @Field()
    exam: string;
    @Field(type => MartialArtsDto)
    martialArt: MartialArtsDto;
    @Field(type => UserDto)
    examiner: UserDto;
    @Field()
    rank: string;
    @Field()
    date: Date;
    @Field()
    reportUri: string;
    @Field()
    passed: boolean;
}