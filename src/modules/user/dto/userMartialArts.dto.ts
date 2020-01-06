import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';
import { RankDto } from 'src/modules/martialArts/dto/rank.dto';

@ObjectType()
export class UserMartialArtsDto {
    @Field()
    martialArt: MartialArtsDto;
    @Field()
    readonly rank: RankDto;
}