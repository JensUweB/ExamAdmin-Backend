import { ObjectType, Field, ID } from 'type-graphql';
import { RankPopDto } from 'src/modules/user/dto/rank.pop.dto';

@ObjectType()
export class SimpleMaRanksDto {
    @Field(() => ID, {nullable: true})
    _id: string;
    @Field({nullable: true})
     rankId: string;
}