import { ObjectType, Field, ID } from 'type-graphql';
import { RankModel } from '../ranks.model';
import { RankInput } from '../inputs/rank.input';
import { UserDto } from 'src/modules/user/dto/user.dto';

/**
 * This DTO (Data transfer object) defines how data will be sent over the network
 */

@ObjectType()
export class MartialArtsDto {
    @Field(type => ID)
    id: string;
    @Field()
    readonly name: string;
    @Field()
    readonly styleName: string;
    @Field(type => [RankModel])
    readonly ranks: RankModel[];
    @Field(type => [UserDto])
    readonly examiners: UserDto[];
}