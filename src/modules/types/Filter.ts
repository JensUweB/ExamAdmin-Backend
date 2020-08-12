import { InputType, Field } from "type-graphql";

@InputType()
export class Filter {
    @Field({description: '', nullable: true})
    minDate: Date;
}