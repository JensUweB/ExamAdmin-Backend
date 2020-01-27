import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtsDto } from '../../martialArts/dto/martialArts.dto';
import { ClubMemberDto } from './clubMember.dto';
import { ReadStream } from 'fs';

@ObjectType()
export class UserDto {
    @Field(() => ID)
    _id: string;
    @Field()
     firstName: string;
    @Field()
     lastName: string;
    @Field()
     email: string;
    @Field()
     password: string;
    @Field(() => [MartialArtsDto], { description: 'Returns an array of Martial Arts. The child array "ranks" should only contain the current rank (at index 0).', nullable: false })
     martialArts: MartialArtsDto[];
    @Field(() => [ClubMemberDto])
     clubs: ClubMemberDto[];
    @Field()
    avatarUri: string;
}