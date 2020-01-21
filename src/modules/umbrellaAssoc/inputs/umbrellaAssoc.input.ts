import { Field, InputType } from 'type-graphql';

@InputType()
export class UmbrellaAssocInput {
    @Field({ description: 'The name of the club', nullable: true })
    readonly name: string;
    @Field({ description: '', nullable: true })
    readonly street: string;
    @Field({ description: '', nullable: true })
    readonly zip: string;
    @Field({ description: '', nullable: true })
    readonly city: string;
    @Field({ description: 'Register of associatoins ID, if exists in country of origin', nullable: true })
    readonly registrationId: string;
    @Field({ description: 'Country of origin', nullable: true })
    readonly country: string;
    @Field(type => [String], { description: 'An array(ids) of provided martial arts in this club', nullable: true })
    readonly martialArts: string[];
    @Field(type => [String], { description: 'An array(ids) of users who administrate this club. Default: The creator of the club.', nullable: true })
    readonly admins: string[];
    @Field({ description: 'An array of clubs that are members of this association', nullable: true })
    readonly clubs: string[];
    @Field({ description: 'An array of users that are members on their own', nullable: true })
    readonly singleMembers: string[];
}
