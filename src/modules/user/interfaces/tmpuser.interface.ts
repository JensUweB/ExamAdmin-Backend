import {Document} from 'mongoose';
import { User } from './user.interface';

export interface TmpUser extends Document {
    user: User;
    uuid: string;
    createdAt: string;
}