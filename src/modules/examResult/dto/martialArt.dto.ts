import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class MartialArtDto {
    @Field(type => ID)
    _id: string;
    @Field()
    name: string;
    @Field()
    styleName: string;
}