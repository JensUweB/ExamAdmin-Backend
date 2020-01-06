import { Injectable } from "@nestjs/common";
import { MartialArts } from "./interfaces/martialArts.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { MartialArtsDto } from "./dto/martialArts.dto";
import { RankDto } from "./dto/rank.dto";

@Injectable()
export class MartialArtsService {

    constructor(@InjectModel('MartialArt') private readonly maModel: Model<MartialArts>) {}

    async create(maInput: MartialArtsInput): Promise<MartialArts> {
        const martialArt = new this.maModel(maInput);
        return martialArt.save();
    }

    async findById(id: string): Model<MartialArts | undefined> {
        return this.maModel.findOne({_id: id}).populate('examiners').exec();
    }

    async findByRank(rankId: string): Model<MartialArts | undefined> {
        return this.maModel.findOne({'ranks._id': rankId});
    }

    async findAll(): Promise<MartialArtsDto[]> {
        return await this.maModel.find().exec();
    }

    async findRank(rankId: string): Promise<RankDto> {
        const result = await this.maModel.findOne({'ranks._id': rankId});
        const rank = result.ranks.filter(rank => {
            return rank._id == rankId;
        });
        return rank[0];
    }

    async update(id: string, input: MartialArtsInput): Model<MartialArts | undefined> {
        const oldMA = await this.findById(id);
        if(input.name) oldMA.name = input.name;
        if(input.styleName) oldMA.stylename = input.styleName;
        if(input.ranks) oldMA.ranks = input.ranks;
        return oldMA.save();
    }
}