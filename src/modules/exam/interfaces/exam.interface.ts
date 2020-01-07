import {Document} from 'mongoose';

export interface Exam extends Document {
    title: string,
    description: string,
    examDate: Date,
    regEndDate: Date,
    club: string,
    examiner: string,
    martialArt: string,
    participants: string[]
}