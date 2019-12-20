import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class UserDto {
    @Field(() => ID)
    id: string;
    @Field()
    readonly firstName: string;
    @Field()
    readonly lastName: string;
    @Field()
    readonly email: string;
    @Field()
    readonly password: string;
}