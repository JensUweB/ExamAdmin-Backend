import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Mongoose Exam Schema
 */

export const ExamSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    examDate: {type: Date, required: true},
    regEndDate: {type: Date, required: true},
    isPublic: {type: Boolean, required: true},
    club: {type: Schema.Types.ObjectId, ref: 'Club'},
    examiner: {type: Schema.Types.ObjectId, ref: 'User'},
    martialArt: {type: Schema.Types.ObjectId, ref: 'MartialArts'},
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
});