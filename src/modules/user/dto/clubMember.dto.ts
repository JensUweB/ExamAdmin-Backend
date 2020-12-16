import { Field, ObjectType } from '@nestjs/graphql';
import { ClubDto } from '../../club/dto/club.dto';

@ObjectType()
export class ClubMemberDto {
    @Field()
    readonly club: ClubDto;
    @Field()
    readonly confirmed: boolean;
}