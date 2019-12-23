import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Mongoose User Schema
 */
export const MartialArtsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    styleName: {type: String, required: true},
    ranks: [{rankName: String, rankNumber: Number}],
    examiners: [{type: Schema.Types.ObjectId, ref: 'User'}]
});