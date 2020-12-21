import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ClubMemberInput {
    @Field({ description: 'The id of the club the user is member of.', nullable: true })
    readonly club: string;
    @Field({ description: 'The confirmation status; false by default. Only turns true, if the club admin confirms the membership.', nullable: true })
    readonly confirmed: boolean;
}