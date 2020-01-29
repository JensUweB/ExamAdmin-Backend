import { Injectable, NotFoundException, UnauthorizedException, NotAcceptableException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UmbrellaAssoc } from "./interfaces/umbrellaAssoc.interface";
import { UmbrellaAssocInput } from "./inputs/umbrellaAssoc.input";
import { UmbrellaAssocDto } from "./dto/umbrellaAssoc.dto";
import { UserService } from "../user/user.service";
import { ClubService } from "../club/club.service";


@Injectable()
export class UmbrellaAssocService {

    constructor(
        @InjectModel('UmbrellaAssociation') private readonly uaModel: Model<UmbrellaAssoc>,
        private readonly userService: UserService,
        private readonly clubService: ClubService
    ) {}

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

    
    async joinRequest(userId: string, clubId: string, uaId: string): Promise<Boolean> {
        if(!uaId) throw new BadRequestException('You need to pass an umbrella association id!');
        const assoc = await this.uaModel.findOne({_id: uaId});
        if(!assoc) throw new NotFoundException('No umbrella association with id "'+uaId+'" found!');
        if(clubId) {
            const club = await this.clubService.findById(clubId);
            if(!club) throw new NotFoundException('No club with _id "'+clubId+'" found!');
            if(!club.admins.some(ele => ele._id == userId)) throw new UnauthorizedException('You are not authorized to do this!');
            club.admins.find
            assoc.joinRequest.push({clubId: clubId});
            assoc.save();
            return true;
        } else if(userId){
            const user = await this.userService.findById(userId);
            if(!user) throw new NotFoundException('No user with _id "'+userId+'" found!');
            assoc.joinRequest.push({userId: userId});
            assoc.save();
            return true;
        } else {
            throw new BadRequestException('You need to pass an user id or a club id!');
        }
    }

    async solveJoinRequest(userId: string, uaId: string, requestId: string, accepted: boolean): Promise<Boolean> {
        const assoc = await this.uaModel.findOne({_id: uaId});
        if(!assoc) throw new NotFoundException(`No umbrella association with _id "${+uaId}" found!`);
        const req = await assoc.joinRequest.find(ele => ele._id == requestId);
        if(!req) throw new NotFoundException(`No join request with _id "${+requestId}" found!`);
        if(!assoc.admins.includes(userId)) throw new UnauthorizedException('You are not authorized to accept join requests for this association!');

        if(accepted){
            if(req.userId) assoc.singleMembers.push(req.userId);
            if(req.clubId) assoc.clubMembers.push(req.clubId);
        }
        assoc.joinRequest = await assoc.joinRequest.filter(ele => ele._id != requestId);
        assoc.save();
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