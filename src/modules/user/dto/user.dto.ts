import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ClubMemberDto } from './clubMember.dto';
import { MaRanksDto } from './maRanks.dto';

@ObjectType()
export class UserDto {
    @Field(() => ID)
      // tslint:disable-next-line:variable-name
    _id: string;
    @Field()
     firstName: string;
    @Field()
     lastName: string;
    @Field()
     email: string;
    @Field()
     password: string;
    @Field(() => [MaRanksDto], { description: 'Returns an array of Martial Arts. The child array "ranks" should only contain the current rank (at index 0).', nullable: true })
     martialArts: MaRanksDto[];
    @Field(() => [ClubMemberDto], {description: '', nullable: true})
     clubs: ClubMemberDto[];
    @Field({description: '', nullable: true})
    avatarUri: string;
}
