import { ClubMemberDto } from './clubMember.dto';
import { MaRanksDto } from './maRanks.dto';
import { ObjectType, Field } from 'type-graphql/dist/decorators';
import { ID } from 'type-graphql/dist/scalars';

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
