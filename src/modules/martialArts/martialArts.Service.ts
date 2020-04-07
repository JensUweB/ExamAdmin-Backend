import { Injectable, HttpException, HttpStatus, NotAcceptableException, NotFoundException, UnauthorizedException, Inject, forwardRef } from "@nestjs/common";
import { MartialArts } from "./interfaces/martialArts.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { RankDto } from "./dto/rank.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class MartialArtsService {
    

    constructor(
        @InjectModel('MartialArt') private readonly maModel: Model<MartialArts>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) { }

    async create(maInput: MartialArtsInput): Promise<MartialArts> {
        const exists = await this.maModel.findOne({name: maInput.name, styleName: maInput.styleName});
        if(exists) throw new NotAcceptableException(`An martial art with the name "${maInput.name}" already exists!`);

        const martialArt = await new this.maModel(maInput);
        return martialArt.save();
    }

    async addExaminer(userId: any, email: string, maId: string) {
        const ma = await this.maModel.findOne({ _id: maId });
        const user = await this.userService.findByEmail(email);

        // Some security checks
        if(!ma) { throw new NotFoundException('Martial Art not found!'); }
        if(!user) { throw new NotFoundException('User not found! Are you sure the email adress is correct?'); }
        if(!ma.examiners.includes(userId)) { throw new UnauthorizedException('You are not authorized to add examiners to this martial art!'); }

        ma.examiners.push(user._id);
        return ma.save();
    }

    async removeExaminer(currentUser: string, userId: string, maId: string) {
        const ma = await this.maModel.findOne({ _id: maId });
        const user = await this.userService.findById(userId);

        // Some security checks
        if(!ma) { throw new NotFoundException('Martial Art not found!'); }
        if(!user) { throw new NotFoundException('User not found! Are you sure the email adress is correct?'); }
        if(!ma.examiners.includes(userId)) { throw new UnauthorizedException('You are not authorized to remove examiners from this martial art!'); }

        ma.examiners = ma.examiners.filter(user => user._id != userId);
        return ma.save();
    }

    async findById(id: string): Model<MartialArts> {
        const result = await this.maModel.findOne({ _id: id }).populate('examiners').exec();
        if(!result) throw new NotFoundException(`No martial art with _id: "${id}" found.`);
        return result;
    }

    async findByRank(rankId: string): Promise<MartialArtsDto> {
        const result = await this.maModel.findOne({ 'ranks._id': rankId });
        if(!result) throw new NotFoundException(`No martial art with rankId: "${rankId}" found.`);
        return result;
    }

    async findAll(): Promise<MartialArtsDto[]> {
        const result = await this.maModel.find().populate('examiners').exec();
        if(!result) throw new NotFoundException(`No martial art found.`);
        /* result.forEach(ma => {
            return ma.examiners.forEach(user => {
                return user = this.userService.populateRanks(user);
            });
        }); */
        return result;
    }

    async findRank(rankId: string): Promise<RankDto> {
        const result = await this.maModel.findOne({ 'ranks._id': rankId });
        if(!result) throw new NotFoundException(`No martial art rank with rankId: "${rankId}" found.`);

        const rank = result.ranks.filter(rank => {
            return rank._id == rankId;
        });
        return rank[0];
    }

    async update(id: string, input: MartialArtsInput, userId: string): Model<MartialArts> {
        const ma = await this.maModel.findOne({ _id: id });
        if(!ma) { throw new NotFoundException(`No martial art with _id: "${id}" found.`); }
        if(!ma.examiners.includes(userId)) { throw new UnauthorizedException('You are not authorized to update this martial art!'); }
        if (input.name) ma.name = input.name;
        if (input.styleName) ma.stylename = input.styleName;
        if (input.description) ma.description = input.description;
        if (input.ranks) ma.ranks = input.ranks;
        
        return ma.save();
    }

    async delete(userId: string, maId): Promise<Boolean> {
        const ma = await this.maModel.findOne({ _id: maId });
        if(!ma) throw new NotFoundException(`No martial art with _id: "${maId}" found.`);
        if(!ma.examiners.includes(userId)) throw new UnauthorizedException('You are not authorized to delete this martial art!');

        for(let i = 0; i < ma.examiners.length; i++) {
            if(ma.examiners[i].toString() == userId){
                const res = await this.maModel.deleteOne({_id: maId});
                if(!res) return false;
                return true;
            }
        }
    }
}