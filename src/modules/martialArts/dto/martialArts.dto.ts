import { ObjectType, Field, ID } from 'type-graphql';
import { RankDto } from './rank.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class MartialArtsDto {
    @Field(type => ID)
    _id: string;
    @Field()
     name: string;
    @Field()
     styleName: string;
    @Field(type => [RankDto])
     ranks: RankDto[];
    @Field(type => [UserDto])
     examiners: UserDto[];
}