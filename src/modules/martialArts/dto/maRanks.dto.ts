import { ObjectType, Field, ID } from 'type-graphql';
import { MartialArtDto } from 'src/modules/examResult/dto/martialArt.dto';

@ObjectType()
export class SimpleMaRanksDto {
    @Field(() => ID)
    _id: string;
    @Field()
     rankName: string;
    @Field()
     rankNumber: string;
}