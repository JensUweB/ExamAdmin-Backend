import { Field, ObjectType } from '@nestjs/graphql';
import { MartialArtsDto } from '../../martialArts/dto/martialArts.dto';

@ObjectType()
export class MaRanksDto {
    @Field(() => MartialArtsDto)
    // tslint:disable-next-line: variable-name
    _id: MartialArtsDto;
    @Field({nullable: true})
     rankId: string;
}
