import { Injectable, Inject, forwardRef, UnauthorizedException, NotFoundException, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { User } from '../user/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { MailerService } from './mailer.service';
import { UserInput } from '../user/input/user.input';
import { UserDto } from '../user/dto/user.dto';
import { TmpUser } from '../user/interfaces/tmpuser.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
    ) { }

    async signUp(input: UserInput): Promise<UserDto | User> {
        let error;
        try {
            const user = await this.userService.findByEmail(input.email);  
            const tmp = await this.userService.findTmpUser(input.email);

            if(user) {
                error = new NotAcceptableException('E-Mail Adress already in use!');
                throw error;
            }
            if(tmp) {
                this.mailerService.resendVerification(tmp);
                return tmp.user;
            }
        } catch (err) {
            if(error) { throw error; }
            const password = await bcrypt.hash(input.password, 10);
            try {
                return this.userService.create({...input, password: password});
            } catch (err) { return err; }
         }            
    }

    /**
     * Check if email and password are correct
     */
    async validateUser({email, password}): Promise<User> {
        let user;
        let valid;
        try{
            user = await this.userService.findByEmail(email);
            valid = await bcrypt.compare(password, user.password);
        } catch (error) {
            if(!user) throw new UnauthorizedException('Email or Password incorrect');
        }                
        if(!valid) throw new UnauthorizedException('Email or Password incorrect');
        return user;
    }

    /**
     * After validating, this will return an access token for you
     */
    async login(user: any): Promise<AuthModel> {
        if(!user) throw new UnauthorizedException('Email or password incorrect');

        const payload = { firstName: user.firstName, userId: user._id };
        
        const result = this.jwtService.sign(payload);
        if(!result) throw new InternalServerErrorException('Token creation failed');

        const authModel = new AuthModel();
        authModel.token = result;
        authModel.tokenExpireDate = new Date(Date.now() + 1000*60*60 + 1000*3600);
        authModel.user = user;

        return authModel;
    }

    async changePassword(id: string, password: string): Promise<Boolean> {
        const user = await this.userService.findById(id);

        if(!user) throw new NotFoundException('Could not find any user with given _id'); // Should never happen, because only logged in users are passed to this function
        const hashPw = await bcrypt.hash(password, 10);
        const result = await this.userService.updatePassword(id, hashPw);

        if(result) return true;
        return false;
    }

    async forgotPassword(email: string): Promise<Boolean> {
        const user = await this.userService.findByEmail(email);
        if(!user) return false;
        const result = this.mailerService.forgotPassword(email, this.jwtService.sign({email: email}));
        if(!result) return false;
        return true;
    }
}