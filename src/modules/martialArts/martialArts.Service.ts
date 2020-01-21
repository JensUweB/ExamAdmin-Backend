import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { MartialArts } from "./interfaces/martialArts.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { RankDto } from "./dto/rank.dto";

@Injectable()
export class MartialArtsService {

    constructor(@InjectModel('MartialArt') private readonly maModel: Model<MartialArts>) { }

    async create(maInput: MartialArtsInput): Promise<MartialArts | Error> {
        const exists = await this.maModel.findOne({name: maInput.name, styleName: maInput.styleName});
        if(exists) return new Error(`An martial art with the name "${maInput.name}" already exists!`);

        const martialArt = await new this.maModel(maInput);
        return martialArt.save();
    }

    async findById(id: string): Model<MartialArts | undefined> {
        return this.maModel.findOne({ _id: id }).populate('examiners').exec();
    }

    async findByRank(rankId: string): Promise<MartialArtsDto | any> {
        const result = await this.maModel.findOne({ 'ranks._id': rankId });

        if (result) return result;
        return new HttpException('Martial Art Rank not found', HttpStatus.NOT_FOUND);
    }

    async findAll(): Promise<MartialArtsDto[]> {
        return await this.maModel.find().populate('examiners').exec();
    }

    async findRank(rankId: string): Promise<RankDto | any> {
        const result = await this.maModel.findOne({ 'ranks._id': rankId });
        if (result) {
            const rank = result.ranks.filter(rank => {
                return rank._id == rankId;
            });
            return rank[0];
        }
        return new HttpException('Martial Art Rank not found', HttpStatus.NOT_FOUND);
    }

    async update(id: string, input: MartialArtsInput): Model<MartialArts | undefined> {
        const ma = await this.findById(id);
        if(ma){
            if (input.name) ma.name = input.name;
            if (input.styleName) ma.stylename = input.styleName;
            if (input.ranks) ma.ranks = input.ranks;
            return ma.save();
        }
        return new HttpException('Martial Art not found', HttpStatus.NOT_FOUND);
    }

    async delete(userId: string, maId): Promise<Number> {
        const ma = await this.maModel.findOne({ _id: maId });

        if(!ma) return -1;
        if(ma.examiners){
            for(let i = 0; i < ma.examiners.length; i++) {
                if(ma.examiners[i].toString() == userId){
                    const res = await this.maModel.deleteOne({_id: maId});
                    if(res) return 1;
                    return 0;
                }
            }
        } else return -2;
    }
}