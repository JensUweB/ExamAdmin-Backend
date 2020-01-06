import { Field, InputType } from 'type-graphql';
import { ClubMemberInput } from './clubMember.input';

@InputType()
export class UserInput {
    @Field()
    readonly firstName: string;
    @Field()
    readonly lastName: string;
    @Field()
    readonly email: string;
    @Field()
    readonly password: string; 
    @Field(() => [String])
    readonly martialArts: string[]
    @Field(() => [ClubMemberInput])
    readonly clubs: ClubMemberInput[];
}