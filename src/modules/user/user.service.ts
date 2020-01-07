import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from './interfaces/user.interface';
import { UserInput } from "./input/user.input";
import { UserDto } from "./dto/user.dto";
import { MartialArtsService } from "../martialArts/martialArts.Service";

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>, readonly maService: MartialArtsService) {}


    async create(userInput: UserInput): Promise<UserDto> {
        const createdUser = new this.userModel(userInput);
        return await createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDto | undefined> {
        const user = this.userModel.findOne({email: email}).populate('clubs.club').exec();

        if(user) return user;
        else return null;
    }

    async findById(id: string): Promise<UserDto | undefined> {
        const user = await this.userModel.findOne({_id: id}).populate('clubs.club').exec();
        
        for (let i=0; i < user.martialArts.length; i++) {
            const ma = await this.maService.findByRank(user.martialArts[i]._id);
            ma.ranks = ma.ranks.filter((rank) => rank._id.toString() == user.martialArts[i]._id.toString());
            if (ma.ranks) {
                user.martialArts[i] = ma;
            }
        }
        return user;
    }

    async update(id: string, input: UserInput) {
        let user = await this.userModel.findOne({_id: id});

        if(input.firstName) user.firstName = input.firstName;
        if(input.lastName) user.lastName = input.lastName;
        if(input.email) user.email = input.email;
        if(input.martialArts) user.martialArts = input.martialArts;
        if(input.clubs) user.clubs = input.clubs;

        return await user.save();
    }

    async addClub(userId: string, clubId: string): Promise<UserDto> {
        const user: Model<User> = await this.findById(userId);
        user.clubs.push({club: clubId, confirmed: false});
        return user.save();
    }

    async addMartialArtRank(userId: string, rankId: string) {
        const user: Model<User> = await this.findById(userId);
        user.martialArts.push({_id: rankId});
        return user.save();
    }

    /* async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    } */
}