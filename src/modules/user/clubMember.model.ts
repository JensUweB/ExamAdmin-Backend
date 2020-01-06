import { ObjectType, Field, ID } from "type-graphql";
import { ClubDto } from "../club/dto/club.dto";

@ObjectType()
export class ClubMemberModel {
        @Field(() => ID)    
        public club: ClubDto; 
        @Field()
        public confirmed: boolean;
}