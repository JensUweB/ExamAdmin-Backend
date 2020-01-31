import { ObjectType, Field, ID } from 'type-graphql';
import { ClubMemberDto } from './clubMember.dto';
import { MaRanksDto } from './maRanks.dto';

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
    @Field(() => [MaRanksDto], { description: 'Returns an array of Martial Arts. The child array "ranks" should only contain the current rank (at index 0).', nullable: false })
     martialArts: MaRanksDto[];
    @Field(() => [ClubMemberDto])
     clubs: ClubMemberDto[];
    @Field()
    avatarUri: string;
}