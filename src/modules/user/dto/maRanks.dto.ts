import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtsDto } from '../../martialArts/dto/martialArts.dto';

@ObjectType()
export class MaRanksDto {
    @Field(() => MartialArtsDto)
    _id: MartialArtsDto;
    @Field()
     rankId: string;
}