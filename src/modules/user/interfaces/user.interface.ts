import {Document} from 'mongoose';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';
import { ClubMemberDto } from '../dto/clubMember.dto';

export interface User extends Document {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly martialArts: MartialArtsDto[];
    readonly clubs: ClubMemberDto[];
}