import * as mongoose from 'mongoose';
import { ID } from 'type-graphql';
import { ClubMemberModel } from './clubMember.model';

const Schema = mongoose.Schema;
/**
 * Mongoose User Schema
 */
export const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    martialArts: [{
        martialArt: {type: Schema.Types.ObjectId, ref: 'MartialArts'}, 
        rank: {rankName: String, rankNumber: Number}
    }],
    clubs: [{
        club: {type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true},
        confirmed: {type: Boolean, required: true}
    }]
});