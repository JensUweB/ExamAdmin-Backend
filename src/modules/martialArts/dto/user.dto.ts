import { ObjectType, Field, ID } from 'type-graphql';
import { ClubMemberDto } from '../../user/dto/clubMember.dto';
import { SimpleMaRanksDto } from './maRanks.dto';
import { MaRanksDto } from '../../user/dto/maRanks.dto';

@ObjectType()
export class SimpleUserDto {
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