import { Field, InputType } from 'type-graphql';

@InputType()
export class ClubMemberInput {
    @Field()
    readonly _id: string;
    @Field()
    readonly confirmed: boolean;
}