import { Injectable } from "@nestjs/common";
import { MartialArts } from "./interfaces/martialArts.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MartialArtsInput } from "./inputs/martialArts.input";
import { MartialArtsDto } from "./dto/martialArts.dto";

@Injectable()
export class MartialArtsService {

    constructor(@InjectModel('MartialArts') private readonly maModel: Model<MartialArts>) {}

    async create(maInput: MartialArtsInput): Promise<MartialArts> {
        const martialArt = new this.maModel(maInput);
        return await martialArt.save();
    }

    async findById(id: string): Promise<MartialArts | undefined> {
        return this.maModel.findOne({_id: id});
    }

    async findAll(): Promise<MartialArtsDto[]> {
        return await this.maModel.find().exec();
    }

    async update(user: Model<MartialArts>) {
        
    }
}