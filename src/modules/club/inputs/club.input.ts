import { Field, InputType } from 'type-graphql';

@InputType()
export class ClubInput {
    @Field({ description: 'You need a description for this?', nullable: true })
    readonly name: string;
    @Field({ description: 'You need a description for this?', nullable: true })
    readonly street: string;
    @Field({ description: 'You need a description for this?', nullable: true })
    readonly zip: string;
    @Field({ description: 'You need a description for this?', nullable: true })
    readonly city: string;
    @Field({ description: 'Register of associatoins ID, if exists in country of origin', nullable: true })
    readonly registrationId: string;
    @Field({ description: 'Country of origin', nullable: true })
    readonly country: string;
    @Field(type => [String], { description: 'An array(ids) of provided martial arts in this club', nullable: true })
    readonly martialArts: string[];
    @Field(type => [String], { description: 'An array(ids) of users who administrate this club. Default: The creator of the club.', nullable: true })
    readonly admins: string[];
}