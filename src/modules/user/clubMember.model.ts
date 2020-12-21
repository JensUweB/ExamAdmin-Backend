import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ClubDto } from '../club/dto/club.dto';

@ObjectType()
export class ClubMemberModel {
        @Field(() => ID)
        public club: ClubDto;
        @Field()
        public confirmed: boolean;
}
