import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Mongoose Martial Art Schema
 */

export const MartialArtSchema = new mongoose.Schema({
    name: {type: String, required: true},
    styleName: {type: String, required: true},
    description: {type: String, required: false},
    ranks: [{name: String, number: Number}],
    examiners: [{type: Schema.Types.ObjectId, ref: 'User'}]
});