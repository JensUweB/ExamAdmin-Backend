import { Injectable, NotFoundException, UnauthorizedException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UmbrellaAssoc } from "./interfaces/umbrellaAssoc.interface";
import { UmbrellaAssocInput } from "./inputs/umbrellaAssoc.input";
import { UmbrellaAssocDto } from "./dto/umbrellaAssoc.dto";


@Injectable()
export class UmbrellaAssocService {

    constructor(@InjectModel('UmbrellaAssociation') private readonly uaModel: Model<UmbrellaAssoc>) {}

    async create(uaInput: UmbrellaAssocInput): Promise<any> {
        const exists = await this.uaModel.findOne({name: uaInput.name});
        if(exists) return new Error('An umbrella association with this name already exists!');

        return new this.uaModel(uaInput).save();
    }

    /**
     * Returns an full populated umbrella association object
     * @param id the id of the umbrella association you are searching for
     */
    async findById(id: string): Promise<any> {
        const result = await this.uaModel.findOne({_id: id})
        .populate('martialArts').populate('admins').populate('clubs')
        .populate('singleMembers').exec();

        if(!result) return new Error('Could not find any umbrella association with given id!');
        return result;
    }

    /**
     * Returns an array of full populated umbrella association object
     */
    async findAll(): Promise<any[]> {
        return this.uaModel.find()
        .populate('martialArts').populate('admins').populate('clubs')
        .populate('singleMembers').exec();
    }

    async update(id: string, input: UmbrellaAssocInput, userId: string): Promise<UmbrellaAssocDto> {
        const ua = await this.uaModel.findOne({_id: id});
        if(!ua.admins.includes(userId)) throw new UnauthorizedException();

        if(input.name) ua.name = input.name;
        if(input.street) ua.street = input.street;
        if(input.zip) ua.zip = input.zip;
        if(input.city) ua.city = input.city;
        if(input.registrationId) ua.registrationId = input.registrationId;
        if(input.country) ua.country = input.country;

        return ua.save();
    }

    async addAdmin(uaId: string, userId: string, currentUser: string): Promise<Boolean> {
        const ua = await this.uaModel.findOne({_id: uaId});
        if(!ua) throw new NotFoundException(`No Umbrella Association with _id: "${uaId}" found!`);
        if(!ua.admins.includes(currentUser)) throw new UnauthorizedException('You are not authorized to add new admins!');

        ua.admins.push({_id: userId});
        const result = ua.save();
        
        if(!result) return false;
        return true;

    }

    async addMartialArt(uaId: string, maId: string, userId: string): Promise<Boolean> {
        const ua = await this.uaModel.findOne({_id: uaId});

        if(!ua.admins.includes(userId)) throw new UnauthorizedException('You are not authorized to add a new martial art to tis association!');
        if(ua.martialArts.includes(maId)) throw new NotAcceptableException('This martial art was already added to the umbrella association!');

        ua.martialArts.push({_id: maId});
        const result = await ua.save();
        if(!result) return false;
        return true;
    }

    async delete(uaId: string, userId: string): Promise<Boolean> {
        const ua = await this.uaModel.findOne({_id: uaId});
        if(!ua.admins.includes(userId)) throw new UnauthorizedException('You are not authorized to delete this umbrella association!');
        
        const result = await this.uaModel.deleteOne({_id: uaId});
        if(result) return true;
        return false;
    }
}