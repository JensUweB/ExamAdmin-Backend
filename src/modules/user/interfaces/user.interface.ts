import {Document} from 'mongoose';
import { ClubMemberDto } from '../dto/clubMember.dto';
import { MaRanksDto } from '../dto/maRanks.dto';

export interface User extends Document {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly martialArts: MaRanksDto[];
    readonly clubs: ClubMemberDto[];
}