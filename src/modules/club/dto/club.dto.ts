import { ObjectType, Field, ID } from 'type-graphql';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class ClubDto {
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
}