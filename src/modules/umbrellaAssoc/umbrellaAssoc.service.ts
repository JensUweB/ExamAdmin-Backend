import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UmbrellaAssoc } from "./interfaces/umbrellaAssoc.interface";
import { UmbrellaAssocInput } from "./inputs/umbrellaAssoc.input";


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

    async update(id: string, input: UmbrellaAssocInput, userId: string): Promise<any> {
        const ua = await this.uaModel.findOne({_id: id});
        const isAdmin = ua.admins.includes(userId);

        if(!isAdmin) return new UnauthorizedException();
        if(input.name) ua.name = input.name;
        if(input.street) ua.street = input.street;
        if(input.zip) ua.zip = input.zip;
        if(input.city) ua.city = input.city;
        if(input.registrationId) ua.registrationId = input.registrationId;
        if(input.country) ua.country = input.country;

        return ua.save();
    }

    async addAdmin(uaId: string, userId: string, currentUser: string): Promise<any> {
        const ua = await this.uaModel.findOne({_id: uaId});
        const isAdmin = await ua.admins.includes(currentUser);

        if(!ua) return new NotFoundException('Umbrella Association not found!');
        if(!isAdmin) return new UnauthorizedException();

    }

    async addMartialArt(uaId: string, maId: string, userId: string): Promise<any> {
        const ua = await this.uaModel.findOne({_id: uaId});
        const isAdmin = await ua.admins.includes(userId);

        if(!isAdmin) return new UnauthorizedException();
        if(ua.martialArts.includes(maId)) return new Error('This martial art was already added to the umbrella association!');
    }

    async delete(uaId: string, userId: string): Promise<any> {
        const ua = await this.uaModel.findOne({_id: uaId});
        const isAdmin = await ua.admins.includes(userId);

        if(!isAdmin) return new UnauthorizedException();
        return this.uaModel.deleteOne({_id: uaId});
    }
}