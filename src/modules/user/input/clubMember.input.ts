import { Field, InputType } from 'type-graphql';

@InputType()
export class ClubMemberInput {
    @Field()
    readonly club: string;
    @Field()
    readonly confirmed: boolean;
}