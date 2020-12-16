import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Filter {
    @Field({description: '', nullable: true})
    minDate: Date;
}
