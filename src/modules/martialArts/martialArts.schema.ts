import * as mongoose from 'mongoose';
import { ID } from 'type-graphql';

/**
 * Mongoose User Schema
 */
export const MartialArtsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    styleName: {type: String, required: true},
    ranks: [{rankName: String, rankNumber: Number}],
    examiners: [{userId: ID}] 
});