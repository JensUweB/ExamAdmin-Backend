import {Document} from 'mongoose';
import { Rank } from './rank.interface';

export interface MartialArts extends Document {
    name: string;
    stylename: string;
    description: string;
    ranks: Rank[];
    examiners: string[];
}