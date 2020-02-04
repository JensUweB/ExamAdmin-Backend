import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtDto } from 'src/modules/examResult/dto/martialArt.dto';

@ObjectType()
export class MaRanksDto {
    @Field(() => MartialArtDto)
    _id: MartialArtDto;
    @Field()
     rankName: string;
    @Field()
     rankNumber: string;
}