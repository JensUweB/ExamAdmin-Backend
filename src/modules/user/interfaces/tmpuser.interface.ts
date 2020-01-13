import {Document} from 'mongoose';
import { User } from './user.interface';

export interface TmpUser extends Document {
    readonly user: User;
    readonly uuid: string;
    readonly createdAt: string;
}