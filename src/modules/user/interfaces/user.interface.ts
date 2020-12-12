import {Document} from 'mongoose';
import { ClubMemberDto } from '../dto/clubMember.dto';
import { MaRanksDto } from '../dto/maRanks.dto';

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    martialArts: MaRanksDto[];
    clubs: ClubMemberDto[];
}