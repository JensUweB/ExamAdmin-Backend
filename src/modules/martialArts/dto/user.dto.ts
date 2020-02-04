import { ObjectType, Field, ID } from 'type-graphql';
import { ClubMemberDto } from '../../user/dto/clubMember.dto';
import { SimpleMaRanksDto } from './maRanks.dto';

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
    @Field(() => [SimpleMaRanksDto], { description: 'Returns an array of Martial Arts. The child array "ranks" should only contain the current rank (at index 0).', nullable: false })
     martialArts: SimpleMaRanksDto[];
    @Field(() => [ClubMemberDto])
     clubs: ClubMemberDto[];
    @Field()
    avatarUri: string;
}