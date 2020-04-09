import { Injectable, HttpException, HttpStatus, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { MaRanksInput } from "./input/maRanks.input";
import { environment } from 'environment';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('TmpUser') private readonly tmpUser: Model<TmpUser>,
        readonly maService: MartialArtsService,
        readonly clubService: ClubService,
        private readonly mailerService: MailerService,
        private authService: AuthService
    ) { }


    /**
     * Create a new user. What else?
     * @param userInput All needed fields in one object! :O
     */
    async create(userInput: UserInput): Promise<UserDto> {
        const id = await this.mailerService.sendVerification(userInput);
        const createdUser = new this.userModel(userInput);
        const tmpuser = new this.tmpUser({user: createdUser, uuid: id, createdAt: new Date(Date.now())}); 
        return tmpuser.save();
    }

    async findTmpUser(email: string): Promise<TmpUser> {
        return this.tmpUser.findOne({'user.email': email});
    }

    async findByConfirmId(uuid: string): Promise<any> {
        const result = await this.tmpUser.findOne({ uuid: uuid });
        if(!result) throw new NotFoundException(`No temporary user with uuid: "${uuid}" found!`);
        return result;
    }

    /**
     * Returns an user object with populated clubs and martialArts (the user ranks) fields. 
     * @param email the user email you want to search for
     */
    async findByEmail(email: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ email: email }).populate('clubs.club').populate('martialArts._id').exec();
       return this.populateRanks(user);
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
        await this.tmpUser.deleteOne({_id: tmpUserId});
        return createdUser.save();
    }

    /**
     * Returns an user object with populated clubs and martialArts (the user ranks) fields. 
     * @param id the user id you want to search for
     */
    async findById(id: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ _id: id }).populate('clubs.club').populate('martialArts._id').exec();
        if(!user) throw new NotFoundException(`No user found with _id: "${id}"`);
        return await this.populateRanks(user);
    }

    async findByClub(clubId: string): Promise<UserDto[]> {
        const result = await this.userModel.find({'clubs.club': clubId });
        if(!result) throw new NotFoundException(`No user who is member of the club with _id: "${clubId}" found!  `);
        return result;
    }

    /**
     * Update user details, if nessesary
     * @param id the user id to update
     * @param input the user input. Just fill fields you wish to update!
     */
    async update(id: string, input: UserInput, newPassword: string): Promise<UserDto> {
        const validate = await this.authService.validateUser({email: input.email, password: input.password}); // Throws an error if validation fails
        let user = await this.userModel.findOne({_id: id});               
        
        if (newPassword && newPassword != '') this.authService.changePassword(id, newPassword);
        if (input.firstName) user.firstName = input.firstName;
        if (input.lastName) user.lastName = input.lastName;
        if (input.email) user.email = input.email;
        if (input.martialArts) user.martialArts = input.martialArts;
        if (input.clubs) user.clubs = input.clubs;
        return user.save();
    }

    async addReportUri(id: string, uri: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ _id: id });
        if(!user) throw new NotFoundException(`Could not find any user with _id: "${id}"`);
        user.avatarUri = uri;
        return user.save();
    }

    /**
     * Add a new club to a user
     * @param userId the user to add the club to
     * @param clubId the club to add
     */
    async addClub(userId: string, clubId: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ _id: userId });

        //Check if a user is already member of the given club
        let res = false;
        if(user.clubs && user.clubs != null){
            for(let i = 0; i < user.clubs.length; i++){
                if(user.clubs[i].club._id.toString() == clubId) res = true;
            }
        } 
        if(res) throw new NotAcceptableException('User is already a member of this club!');

        if (user) {
            user.clubs.push({ club: clubId, confirmed: ! environment.enableClubs }); // If clubs are disabled, set confirmed to true by default 
            await user.save();
            return await this.userModel.findOne({ _id: user._id }).populate('clubs.club').exec();
        }

        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async removeClub(userId: string, clubId: string): Promise<Boolean | Error> {
        const user = await this.userModel.findOne({ _id: userId });
        const club = await this.clubService.findById(clubId);

        if(!club) return new Error('Club does not exist.'); 

        let remove = false;
        user.clubs = await user.clubs.filter(ele => {
            if(ele.club.toString() == clubId) remove = true;
            return ele.club.toString() != clubId;
        });
        const result = await user.save();

        if(!result) return new Error('Unexpected Server Error! Saving user object failed!');
        if(!remove) return new Error('User is no member of this club.');
        if(result && remove && club) return true;
        return false;        
    }

    /**
     * You can add a new martial art rank to a user.
     * Updates the existing rank, if martial art id is found. Adds an new entry otherwise.
     * This will NOT search for an existing rank of the same martial art!
     * @param userId the user to add the new rank to
     * @param rankId the martial art rank to add
     */
    async addMartialArtRank(currentUser: string, userId: string, input: MaRanksInput): Promise<UserDto> {
        if(!userId) userId = currentUser;
        const user = await this.userModel.findOne({ _id: userId });
        if(!user) throw new NotFoundException('User not found!');
        let containsRank;
        // Checks if the user already contains the specified rankId
        if(user.martialArts.length) containsRank = await user.martialArts.some(element => element._id.toString() == input._id);
        if(containsRank){
            if(userId == currentUser) throw new UnauthorizedException('You need to participate in an exam to get an new rank!');
            user.martialArts.forEach(element => {
                if(element._id.toString() == input._id) {
                    element.rankId = input.rankId;
                }
            });
        } else {
            user.martialArts.push({ 
                _id: input._id,
                rankId: input.rankId,
            });
        }
        
        return user.save();
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

    async populateRanks(user): Promise<UserDto> {
        if(!user) return undefined;
        // We don't know if we get a populated user object, so we're doing it here just to be save
        user = await this.userModel.findOne({ _id: user._id }).populate('clubs.club').populate('martialArts._id').exec();
        
        if(user.martialArts.length > 0) {
            await user.martialArts.forEach(item => {
                if(item._id) item._id.ranks = item._id.ranks.filter(rank => rank._id == item.rankId);
            });
            return user;
        } else {
            return user;
        }
    }
}