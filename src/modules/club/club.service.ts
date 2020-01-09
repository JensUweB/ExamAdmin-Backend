import { Injectable, NotImplementedException, HttpStatus, HttpException } from "@nestjs/common";
import { Club } from "./interfaces/club.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClubDto } from "./dto/club.dto";
import { ClubInput } from "./inputs/club.input";

@Injectable()
export class ClubService {

    constructor(@InjectModel('Club') private readonly clubModel: Model<Club>) {}

    async create(clubInput: ClubInput): Promise<ClubDto> {
        return new this.clubModel(clubInput).save();
    }
    async findById(id: string):Promise<ClubDto | undefined> {
        return this.clubModel.findOne({_id: id}).populate('martialArts').populate('admins').exec();
    }
    async findAll(): Promise<ClubDto[]> {
        return await this.clubModel.find().exec();
    }
    async update(id: string, input: ClubInput): Promise<ClubDto> {
        const oldClub = await this.clubModel.findOne({_id: id});
        if(input.name) oldClub.name = input.name;
        if(input.street) oldClub.street = input.street;
        if(input.zip) oldClub.zip = input.zip;
        if(input.city) oldClub.city = input.city;
        if(input.registrationId) oldClub.registrationId = input.registrationId;
        if(input.country) oldClub.country = input.country;
        if(input.martialArts) oldClub.martialArts = input.martialArts;
        if(input.admins) oldClub.admins = input.admins;
        return oldClub.save();

    }
    async addAdmin(clubId: string, userId: string): Promise<ClubDto | undefined> {
        const club = await this.clubModel.findOne({_id: clubId});

        // Search if user was already added
        const filter = club.admins.filter(a => {
            a._id == userId;
        });

        // Return null, if user was found
        if(filter) return null; 

        // Else add user to array and save
        club.admins.push(userId);
        return club.save();
    }
    async addMartialArt(): Promise<ClubDto> {
        throw NotImplementedException;
    }
    async addMember(): Promise<ClubDto> {
        throw NotImplementedException;
    }

    async findAllMembers() {
        throw NotImplementedException;
    }

}