import { Field, InputType } from 'type-graphql';

@InputType()
export class ClubInput {
    @Field({ description: 'The name of the club', nullable: false })
    readonly name: string;
    @Field({ description: '', nullable: false })
    readonly street: string;
    @Field({ description: '', nullable: false })
    readonly zip: string;
    @Field({ description: '', nullable: false })
    readonly city: string;
    @Field({ description: 'Register of associatoins ID, if exists in country of origin', nullable: false })
    readonly registrationId: string;
    @Field({ description: 'Country of origin', nullable: false })
    readonly country: string;
    @Field(type => [String], { description: 'An array(ids) of provided martial arts in this club', nullable: false })
    readonly martialArts: string[];
    @Field(type => [String], { description: 'An array(ids) of users who administrate this club. Default: The creator of the club.', nullable: false })
    readonly admins: string[];
}