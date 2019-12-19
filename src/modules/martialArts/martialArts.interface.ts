import {Document} from 'mongoose';

export interface MartialArts extends Document {
    readonly name: string;
    readonly stylename: string;
    readonly ranks: [{rankName: String, rankNumber: Number}];
    readonly examiners: [{userId: String}] ;
}