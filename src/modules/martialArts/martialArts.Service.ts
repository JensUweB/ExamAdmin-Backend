import { Injectable } from "@nestjs/common";
import { MartialArts } from "./martialArts.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MartialArtsInput } from "./inputs/martialArts.input";

@Injectable()
export class MartialArtsService {

    constructor(@InjectModel('MartialArts') private readonly maModel: Model<MartialArts>) {}

    async create(maInput: MartialArtsInput): Promise<MartialArts> {
        const martialArt = new this.maModel(maInput);
        return await martialArt.save();
    }

    async findById(id: string): Promise<MartialArts | undefined> {
        return this.maModel.find(ma => ma.id === id);
    }

    async findAll(): Promise<[MartialArts]> {
        return await this.maModel.find().exec();
    }
}