import { Field, ObjectType } from 'type-graphql';
import { ClubDto } from 'src/modules/club/dto/club.dto';

@ObjectType()
export class ClubMemberDto {
    @Field()
    readonly club: ClubDto;
    @Field()
    readonly confirmed: boolean;
}