import {Document} from 'mongoose';

export interface Rank extends Document {
    name: string;
    number: number;
}