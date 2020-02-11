import { ObjectType, Field, ID } from 'type-graphql';
import { RankDto } from './rank.dto';
import { SimpleUserDto } from './user.dto';

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
    @Field({ description: '', nullable: true })
    description: string;
    @Field(type => [RankDto])
    ranks: RankDto[];
    @Field(type => [SimpleUserDto],{description: '', nullable: true})
    examiners: SimpleUserDto[];
}