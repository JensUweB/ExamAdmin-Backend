import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Mongoose User Schema
 */
export const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    martialArts: [{type: Schema.Types.ObjectId, required: true}],
    clubs: [{
        club: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        confirmed: {type: Boolean, required: true}
    }],
    avatarUri: {type: String, required: false}
});