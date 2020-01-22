import { Injectable, UnauthorizedException, Inject, forwardRef, NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common";
import { Club } from "./interfaces/club.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClubDto } from "./dto/club.dto";
import { ClubInput } from "./inputs/club.input";
import { UserService } from "../user/user.service";
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class ClubService {

    constructor(
        @InjectModel('Club') private readonly clubModel: Model<Club>, 
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) {}

    async create(clubInput: ClubInput): Promise<ClubDto | Error> {
        const exists = await this.clubModel.findOne({name: clubInput.name});
        if(exists) throw new ForbiddenException(`An club with the name "${clubInput.name}" already exists!`);

        return new this.clubModel(clubInput).save();
    }
    async findById(id: string):Promise<ClubDto> {
        const club = await this.clubModel.findOne({_id: id}).populate('martialArts').populate('admins').exec();
        if(!club) throw new NotFoundException('Could not find any club with given _id');
        return club;
    }
    async findAll(): Promise<ClubDto[]> {
        const clubArr = await this.clubModel.find().populate('martialArts').populate('admins').exec();
        if(!clubArr) throw new NotFoundException('Could not find any club. Maybe the database is just empty?');
        return clubArr;
    }
    async update(id: string, input: ClubInput): Promise<ClubDto> {
        const oldClub = await this.clubModel.findOne({_id: id});
        if(!oldClub) throw new NotFoundException(`No club with _id: "${id}" found.`);
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

    /**
     * Adds a new admin user to a club
     * @param clubId the id of the club
     * @param userId the user id of the new admin
     * @param currentUser the currently logged in user
     */
    async addAdmin(clubId: string, userId: string, currentUser: string): Promise<Boolean> {
        const club = await this.clubModel.findOne({_id: clubId});

        if(!club.admins.includes(currentUser)) throw new UnauthorizedException('Only the club admin is allowed to promote new admins.');

        // Search if user was already added
        if(club.admins.includes(userId)) throw new ConflictException('This user is already admin of the club!');

        // Else add user to array and save
        club.admins.push(userId);
        const res = await club.save();
        if(res) return true;
        return false;
    }

    /**
     * Adds a martial art to a given club
     * @param userId the id of the current user
     * @param clubId the id of the club
     * @param maId the id of the martial art to add
     */
    async addMartialArt(userId: string, clubId: string, maId: string): Promise<ClubDto | any> {
        const club = await this.clubModel.findOne({_id: clubId});
        const isAdmin = club.admins.includes(userId);
        const exists = club.martialArts.includes(maId);

        if(!isAdmin) throw new UnauthorizedException('Only club admins can add new martial arts to the club.');
        if(exists) return new ConflictException('Club already contains this martial art!');
        club.martialArts.push({_id: maId});
        return club.save();
    }

    async getAllMembers(userId: string, clubId: string): Promise<UserDto[] | any> {
        const club = await this.clubModel.findOne({_id: clubId});

        if(!club) throw new NotFoundException(`Could not find club with id "${clubId}"`);
        if(!club.admins.includes(userId)) return new UnauthorizedException();

        const members = await this.userService.findByClub(clubId);
        if(members == []) throw new Error('This club has no members yet');
        return members;
    }

    async delete(userId: string, clubId: string): Promise<Boolean>{
        const club = await this.clubModel.findOne({_id: clubId});

        if(!club) throw new NotFoundException('Could not find any club with given _id');
        if(!club.admins.includes(userId)) throw new UnauthorizedException('You are not authorized to delete this club');

        const res = await this.clubModel.deleteOne({_id: clubId});
        if(res) return true;
        return false;
    }
}