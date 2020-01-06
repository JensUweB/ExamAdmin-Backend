import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';
import { UserMartialArtsDto } from './userMartialArts.dto';

@ObjectType()
export class UserDto {
    @Field(() => ID)
    _id: string;
    @Field()
    readonly firstName: string;
    @Field()
    readonly lastName: string;
    @Field()
    readonly email: string;
    @Field()
    readonly password: string;
    @Field(() => [UserMartialArtsDto])
    readonly martialArts: UserMartialArtsDto[]
    @Field(() => [UserDto])
    readonly admins: [UserDto]
}