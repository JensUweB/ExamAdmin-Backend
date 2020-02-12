import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Mongoose Exam Result Schema
 */

export const ExamResultSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    exam: {type: Schema.Types.ObjectId, ref: 'Exam'},
    martialArt: {
        _id: {type: Schema.Types.ObjectId, ref: 'MartialArt'},
        name: {type: String, required: true},
        styleName: {type: String, required: true}
    },
    examiner: {
        _id: {type: Schema.Types.ObjectId, ref: 'User'},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    rank: {type: String, required: true},
    date: {type: Date, required: true},
    reportUri: {type: String, required: false},
    passed: {type: Boolean, required: true}
});