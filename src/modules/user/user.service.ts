import {
    Injectable,
    HttpException,
    HttpStatus,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserInput } from './input/user.input';
import { UserDto } from './dto/user.dto';
import { MartialArtsService } from '../martialArts/martialArts.Service';
import { ClubService } from '../club/club.service';
import { Club } from '../club/interfaces/club.interface';
import { MartialArts } from '../martialArts/interfaces/martialArts.interface';
import { MailerService } from '../auth/mailer.service';
import { TmpUser } from './interfaces/tmpuser.interface';
import { MaRanksInput } from './input/maRanks.input';
import { environment } from 'environment';
import { AuthService } from '../auth/auth.service';
import { Helper } from '../helpers/helper.class';
import { MartialArtsDto } from '../martialArts/dto/martialArts.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('TmpUser') private readonly tmpUser: Model<TmpUser>,
        readonly maService: MartialArtsService,
        readonly clubService: ClubService,
        private readonly mailerService: MailerService,
        private authService: AuthService,
    ) { }

    /**
     * Create a new user. What else?
     * @param userInput All needed fields in one object! :O
     */
    async create(userInput: UserInput): Promise<UserDto> {
        const id = await this.mailerService.sendVerification(userInput);
        const createdUser = new this.userModel(userInput);
        const tmpUser: any = new this.tmpUser({user: createdUser, uuid: id, createdAt: new Date(Date.now())});
        return tmpUser.save();
    }

    async findTmpUser(email: string): Promise<TmpUser> {
        return this.tmpUser.findOne({'user.email': email});
    }

    async findByConfirmId(uuid: string): Promise<any> {
        const result = await this.tmpUser.findOne({ uuid });
        if (!result) {
            throw new NotFoundException(`No temporary user with uuid: "${uuid}" found!`);
        }
        return result;
    }

    /**
     * Returns an user object with populated clubs and martialArts (the user ranks) fields.
     * @param email the user email you want to search for
     */
    async findByEmail(email: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ email }).populate('clubs.club').populate('martialArts._id').exec();
        return this.populateRanks(user);
    }

    async addUser(user: any, tmpUserId: string): Promise<UserDto> {
        const createdUser: any = new this.userModel({
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
        const user: any = await this.userModel.findOne({ _id: id }).populate('clubs.club').populate('martialArts._id').exec();
        if (!user) {
            throw new NotFoundException(`No user found with _id: "${id}"`);
        }
        return this.populateRanks(user);
    }

    async findByClub(clubId: string): Promise<UserDto[]> {
        const result: any[] = await this.userModel.find({'clubs.club': clubId });
        if (!result) {
            throw new NotFoundException(`No user who is member of the club with _id: "${clubId}" found!  `);
        }
        return result;
    }

    /**
     * Update user details, if necessary
     * @param id the user id to update
     * @param input the user input. Just fill fields you wish to update!
     */
    async update(id: string, input: UserInput): Promise<UserDto> {
        // Throws an error if validation fails
        // const validate = await this.authService.validateUser({email: input.email, password: input.password});
        const user: any = await this.userModel.findOne({_id: id});

        if (input) {
            if (Helper.falsify(input.firstName)) { user.firstName = input.firstName; }
            if (Helper.falsify(input.lastName)) { user.lastName = input.lastName; }
            if (Helper.falsify(input.email)) { user.email = input.email; }
            if (Helper.falsify(input.newPassword)) { await this.authService.changePassword(id, input.newPassword); }
            if (Helper.falsify(input.martialArts)) { user.martialArts = input.martialArts; }
            if (Helper.falsify(input.clubs)) { user.clubs = input.clubs; }
        }
        return user.save();
    }

    async updateRank(userId: string, maId: string , rank: string): Promise<UserDto> {
        const user: any = await this.userModel.findOne({ _id: userId });
        const ma = await this.maService.findById(maId);
        const rankId = ma.ranks.filter(item => item.name === rank)[0]._id;

        // Check if user has already any rank of the given martial art
        if (user.martialArts.some(martialArt => martialArt._id === maId)) {
            // Martial Art found. Change user rank
            user.martialArts.forEach(m => {
                if (m._id === maId) { m.rankId = rankId; }
            });
        } else {
            // Martial Art not found. Push new Object to array
            user.martialArts.push({_id: maId, rankId});
        }

        return user.save();
    }

    async addReportUri(id: string, uri: string): Promise<UserDto> {
        const user: any = await this.userModel.findOne({ _id: id });
        if (!user) {
            throw new NotFoundException(`Could not find any user with _id: "${id}"`);
        }
        user.avatarUri = uri;
        return user.save();
    }

    /**
     * Add a new club to a user
     * @param userId the user to add the club to
     * @param clubId the club to add
     */
    async addClub(userId: string, clubId: string): Promise<UserDto> {
        const user: any = await this.userModel.findOne({ _id: userId });

        // Check if a user is already member of the given club
        let res = false;
        if (user.clubs) {
            // tslint:disable-next-line:prefer-for-of // TODO: change
            for (let i = 0; i < user.clubs.length; i++) {
                if (user.clubs[i].club._id.toString() === clubId) {
                    res = true;
                }
            }
        }
        if (res) {
            throw new NotAcceptableException('User is already a member of this club!');
        }

        if (user) {
            user.clubs.push({ club: clubId, confirmed: ! environment.enableClubs }); // If clubs are disabled, set confirmed to true by default
            await user.save();
            const result: any = await this.userModel.findOne({ _id: user._id }).populate('clubs.club').exec();
            return result;
        }

        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async removeClub(userId: string, clubId: string): Promise<boolean | Error> {
        const user: any = await this.userModel.findOne({ _id: userId });
        const club = await this.clubService.findById(clubId);

        if (!club) {
            return new Error('Club does not exist.');
        }

        let remove = false;
        user.clubs = await user.clubs.filter(ele => {
            if (ele.club.toString() === clubId) {
                remove = true;
            }
            return ele.club.toString() !== clubId;
        });
        const result = await user.save();

        if (!result) {
            return new Error('Unexpected Server Error! Saving user object failed!');
        }
        if (!remove) {
            return new Error('User is no member of this club.');
        }
        return !!(result && remove && club);
    }

    /**
     * You can add a new martial art rank to a user.
     * Updates the existing rank, if martial art id is found. Adds an new entry otherwise.
     * This will NOT search for an existing rank of the same martial art!
     * @param currentUser
     * @param userId the user to add the new rank to
     * @param input
     */
    async addMartialArtRank(currentUser: string, userId: string, input: MaRanksInput): Promise<UserDto> {
        if (!userId) {
            userId = currentUser;
        }
        const user: any = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        let containsRank;
        // Checks if the user already contains the specified rankId
        if (user.martialArts.length) {
            containsRank = await user.martialArts.some(element => element._id.toString() === input._id);
        }
        if (containsRank) {
            if (userId === currentUser) {
                throw new UnauthorizedException('You need to participate in an exam to get an new rank!');
            }
            user.martialArts.forEach(element => {
                if (element._id.toString() === input._id) {
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
     * You need to delete ExamResults BEFORE deleting the user separately!
     * @param id The _id of the user to delete
     */
    async deleteUser(id: string): Promise<boolean> {
        const user: any = await this.findById(id);

        // VALIDATION AREA BEFORE DELETING USER

        // VALIDATION AREA ENDS

        // DELETE AREA

        // Remove user from all club admin arrays, if exists
        if (user.clubs.length) {
            for (const c of user.clubs) {
                this.clubService.removeAdmin(user._id, user._id, c.club._id).catch();
            }
        }

        // Remove user from all martial arts examiner arrays, if exists
        const maArray: MartialArtsDto[] = await this.maService.findAll();
        for (const ma of maArray) {
            if (ma.examiners.length && ma.examiners.some(examiner => examiner._id === user._id)) {
                this.maService.removeExaminer(user._id, user._id, ma._id).catch();
            }
        }

        const result = await this.userModel.deleteOne({ _id: id });
        return !!result;
    }

    async updatePassword(id: string, hashedPw: string): Promise<UserDto | any> {
        const user: any = await this.userModel.findOne({_id: id});
        user.password = hashedPw;
        await this.mailerService.passwordReset(user.email);
        plainToClass(UserDto, await user.save());
    }

    async populateRanks(user): Promise<UserDto> {
        if (!user) {
            return undefined;
        }
        // We don't know if we get a populated user object, so we're doing it here just to be save
        user = await this.userModel.findOne({ _id: user._id }).populate('clubs.club').populate('martialArts._id').exec();

        if (user.martialArts.length > 0) {
            await user.martialArts.forEach(item => {
                if (item._id) {
                    item._id.ranks = item._id.ranks.filter(rank => rank._id === item.rankId);
                }
            });
            return user;
        } else {
            return user;
        }
    }
}
