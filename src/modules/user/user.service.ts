import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from './interfaces/user.interface';
import { UserInput } from "./input/user.input";
import { UserDto } from "./dto/user.dto";
import { MartialArtsService } from "../martialArts/martialArts.Service";
import { ClubService } from "../club/club.service";
import { Club } from "../club/interfaces/club.interface";
import { MartialArts } from "../martialArts/interfaces/martialArts.interface";
import { MailerService } from "../auth/mailer.service";
import { TmpUser } from "./interfaces/tmpuser.interface";

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('TmpUser') private readonly tmpUser: Model<TmpUser>,
        readonly maService: MartialArtsService,
        readonly clubService: ClubService,
        private readonly mailerService: MailerService
    ) { }


    /**
     * Create a new user. What else?
     * @param userInput All needed fields in one object! :O
     */
    async create(userInput: UserInput): Promise<UserDto | any> {
        const id = await this.mailerService.sendVerification(userInput);
        const createdUser = new this.userModel(userInput);
        const tmpuser = new this.tmpUser({user: createdUser, uuid: id, createdAt: new Date(Date.now())}); 
        return tmpuser.save();
    }

    async findByConfirmId(uuid: string): Promise<any> {
        return await this.tmpUser.findOne({ uuid: uuid });
    }

    /**
     * Returns an user object with populated clubs and martialArts (the user ranks) fields. 
     * @param email the user email you want to search for
     */
    async findByEmail(email: string): Promise<UserDto | undefined> {
        const user = await this.userModel.findOne({ email: email }).populate('clubs.club').exec();
        
        if (user) {
            if (user.martialArts) {
                for (let i = 0; i < user.martialArts.length; i++) {
                    const ma = await this.maService.findByRank(user.martialArts[i]._id);
                    ma.ranks = ma.ranks.filter((rank) => rank._id.toString() == user.martialArts[i]._id.toString());
                    if (ma.ranks) {
                        user.martialArts[i] = ma;
                    }
                }
            }
        }
        return user;
    }

    async addUser(user: any, tmpUserId: string): Promise<any> {
        const createdUser = new this.userModel({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            clubs: user.clubs,
            martialArts: user.martialArts,
        });
        console.log(tmpUserId);
        await this.tmpUser.deleteOne({_id: tmpUserId});
        return createdUser.save();
    }

    /**
     * Returns an user object with populated clubs and martialArts (the user ranks) fields. 
     * @param id the user id you want to search for
     */
    async findById(id: string): Promise<UserDto | any> {
        const user = await this.userModel.findOne({ _id: id }).populate('clubs.club').exec();

        for (let i = 0; i < user.martialArts.length; i++) {
            const ma = await this.maService.findByRank(user.martialArts[i]._id);
            ma.ranks = ma.ranks.filter((rank) => rank._id.toString() == user.martialArts[i]._id.toString());
            if (ma.ranks) {
                user.martialArts[i] = ma;
            }
        }
        if (user) return user;
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Update user details, if nessesary
     * @param id the user id to update
     * @param input the user input. Just fill fields you wish to update!
     */
    async update(id: string, input: UserInput): Promise<UserDto | any> {
        let user = await this.userModel.findOne({ _id: id });

        if (user) {
            if (input.firstName) user.firstName = input.firstName;
            if (input.lastName) user.lastName = input.lastName;
            if (input.email) user.email = input.email;
            if (input.martialArts) user.martialArts = input.martialArts;
            if (input.clubs) user.clubs = input.clubs;
            return await user.save();
        }
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Add a new club to a user
     * @param userId the user to add the club to
     * @param clubId the club to add
     */
    async addClub(userId: string, clubId: string): Promise<UserDto | any> {
        const user = await this.userModel.findOne({ _id: userId });

        if (user) {
            user.clubs.push({ club: clubId, confirmed: false });
            return user.save();
            //return await this.userModel.findOne({ _id: user._id }).populate('clubs.club').exec();
        }

        return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * You can add a new martial art rank to a user.
     * This will NOT search for an existing rank of the same martial art!
     * @param userId the user to add the new rank to
     * @param rankId the martial art rank to add
     */
    async addMartialArtRank(userId: string, rankId: string): Promise<UserDto | any> {
        const user: Model<User> = await this.findById(userId);
        if (user) {
            user.martialArts.push({ _id: rankId });
            return user.save();
        }
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Deletes an user account and removes dependencies like club.admins or martialArt.examiner.
     * You need to delete ExamResults BEVORE deleting the user seperately! 
     * @param id The _id of the user to delete
     */
    async deleteUser(id: string) {
        const user = await this.findById(id);
        const clubs = [];

        // VALIDATION AREA BEFORE DELETING USER

        // VALIDATION AREA ENDS

        //DELETE AREA

        // Remove user from all club admin arrays, if exists
        if (user.clubs.length) {
            for (let i = 0; i < user.clubs.length; i++) {
                let club: Model<Club> = await this.clubService.findById(user.clubs[i].club._id); //Get Club as mongoose object

                club.admins.filter(res => res._id.toString() != id);
                club.save();
            }
        }

        // Remove user from all martial arts examiner arrays, if exists
        let maArray: Model<MartialArts> = await this.maService.findAll();
        for (let i = 0; i < maArray.length; i++) {
            if (maArray[i].examiners.length) {
                maArray[i].examiners.filter(res => res._id.toString() != id);
                maArray[i].save();
            }
        }

        const result = await this.userModel.deleteOne({ _id: id });
        if (result) { return true }
        else return false;
    }

    async updatePassword(id: string, hashedPw: string): Promise<UserDto | undefined> {
        const user = await this.userModel.findOne({_id: id});
        user.password = hashedPw;
        this.mailerService.passwordReset(user.email);
        return user.save();
    }
}