import {Document} from 'mongoose';
import { MartialArtsDto } from 'src/modules/martialArts/dto/martialArts.dto';

export interface Club extends Document {
    name: string;
    street: string;
    zip: string;
    city: string;
    registrationId: string;
    country: string;
    martialArts: MartialArtsDto[];
    admins: string[];
}