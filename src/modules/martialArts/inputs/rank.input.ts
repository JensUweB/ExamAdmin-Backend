import { InputType, Field } from 'type-graphql';

@InputType()
export class RankInput {
        @Field({nullable: true})
        public _id: string;
        @Field({ description: 'The name of the martial art rank', nullable: false })
        public name: string;
        @Field({ description: 'The number of the martial art rank. We are assuming, that number 1 is your grand master (highest rank)!', nullable: false })
        public number: number;
}