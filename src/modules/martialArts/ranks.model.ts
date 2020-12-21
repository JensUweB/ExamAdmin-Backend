import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RankModel {
        @Field()
        public rankName: string;
        @Field()
        public rankNumber: number;
}