import {Document} from 'mongoose';

export interface ExamResult extends Document {
    user: string,
    exam: string,
    martialArt: {
        _id: string,
        name: string,
        styleName: string
    },
    examiner: {
        _id: string,
        firstName: string,
        lastName: string,
    },
    rank: string,
    date: string,
    reportUri: string,
    passed: boolean
}