import {Document} from 'mongoose';
import { RankModel } from '../ranks.model';

export interface MartialArts extends Document {
    readonly name: string;
    readonly stylename: string;
    readonly ranks: RankModel[];
    readonly examiners: string[];
}