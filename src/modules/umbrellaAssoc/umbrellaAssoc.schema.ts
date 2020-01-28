import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Mongoose Club Schema
 */
export const UmbrellaAssocSchema = new mongoose.Schema({
    name: {type: String, required: true},
    street: {type: String, required: true},
    zip: {type: String, required: true},
    city: {type: String, required: true},
    registrationId: {type: String, required: true},
    country: {type: String, required: true},
    martialArts: [{type: Schema.Types.ObjectId, required: true, ref: 'MartialArt'}],
    admins: [{type: Schema.Types.ObjectId, required: true, ref: 'User'}],
    clubs: [{type: Schema.Types.ObjectId, required: true, ref: 'Club'}],
    singleMembers: [{type: Schema.Types.ObjectId, required: false, ref: 'User'}],
    joinRequest: [{
        userId: {type: String, required: false},
        clubId: {type: String, required: false},
    }]
});