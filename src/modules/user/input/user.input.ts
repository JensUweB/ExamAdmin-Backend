import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
    @Field()
    readonly firstName: string;
    @Field()
    readonly lastName: string;
    @Field()
    readonly email: string;
    @Field()
    readonly password: string; 
}