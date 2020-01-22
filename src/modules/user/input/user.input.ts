import { Field, InputType } from 'type-graphql';
import { ClubMemberInput } from './clubMember.input';

@InputType()
export class UserInput {
    @Field({ description: 'The users first name', nullable: true })
    readonly firstName: string;
    @Field({ description: 'The users last name', nullable: true })
    readonly lastName: string;
    @Field({ description: 'The users email address', nullable: true })
    readonly email: string;
    @Field({ description: 'The users password. Will be turned into a hash before we write it into the database.', nullable: true })
    readonly password: string; 
    @Field(() => [String], { description: 'An array of martial art rank ids. We look out that you dont insert two ranks of the same martial art.', nullable: true })
    readonly martialArts: string[]
    @Field(() => [ClubMemberInput], { description: 'An array of clubs the user is (or wants to be) an member of.', nullable: true })
    readonly clubs: ClubMemberInput[];
}