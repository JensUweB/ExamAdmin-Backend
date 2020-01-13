import * as mongoose from 'mongoose';
import { UserSchema } from './user.schema';

const Schema = mongoose.Schema;
/**
 * Mongoose TmpUser Schema
 */
export const TmpUserSchema = new mongoose.Schema({
    user: UserSchema,
    uuid: {type: String, required: true},
    createdAt: {type: String, required: true}
});