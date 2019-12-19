import * as mongoose from 'mongoose';
import { ID } from 'type-graphql';

/**
 * Mongoose User Schema
 */
export const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    martialArts: [{
        maId: ID, 
        rankId: ID
    }]
});