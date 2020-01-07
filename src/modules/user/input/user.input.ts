import { Field, InputType } from 'type-graphql';
import { ClubMemberInput } from './clubMember.input';

@InputType()
export class UserInput {
    @Field({ description: '', nullable: true })
    readonly firstName: string;
    @Field({ description: '', nullable: true })
    readonly lastName: string;
    @Field({ description: '', nullable: true })
    readonly email: string;
    @Field({ description: '', nullable: true })
    readonly password: string; 
    @Field(() => [String], { description: '', nullable: true })
    readonly martialArts: string[]
    @Field(() => [ClubMemberInput], { description: '', nullable: true })
    readonly clubs: ClubMemberInput[];
}