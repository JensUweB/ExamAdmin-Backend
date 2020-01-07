import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';
import { ClubDto } from 'src/modules/club/dto/club.dto';
import { ClubMemberDto } from './clubMember.dto';

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
}