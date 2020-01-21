import { ObjectType, Field, ID } from 'type-graphql';
import { UserDto } from '../../user/dto/user.dto';
import { MartialArtsDto } from '../../martialArts/dto/martialArts.dto';

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class UmbrellaAssocDto {
    @Field(type => ID)
    _id: string;
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
    @Field(type => [MartialArtsDto], { description: 'An array(ids) of provided martial arts in this club', nullable: false })
    readonly martialArts: MartialArtsDto[];
    @Field(type => [UserDto], { description: 'An array(ids) of users who administrate this club. Default: The creator of the club.', nullable: false })
    readonly admins: UserDto[];
    @Field(type => [String], { description: 'An array of clubs that are members of this association', nullable: true })
    readonly clubs: string[];
    @Field(type => [String], { description: 'An array of users that are members on their own', nullable: true })
    readonly singleMembers: string[];
}