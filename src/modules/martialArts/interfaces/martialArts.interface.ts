import {Document} from 'mongoose';
import { RankModel } from '../ranks.model';

export interface MartialArts extends Document {
    name: string;
    stylename: string;
    ranks: RankModel[];
    examiners: string[];
}