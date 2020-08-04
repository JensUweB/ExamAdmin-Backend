import { Injectable, Inject, forwardRef, UnauthorizedException, NotFoundException, InternalServerErrorException, NotAcceptableException, ServiceUnavailableException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { User } from '../user/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { MailerService } from './mailer.service';
import { UserInput } from '../user/input/user.input';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
    ) { }

    async signUp(input: UserInput): Promise<any> {
        const user = await this.userService.findByEmail(input.email);  
        const tmp = await this.userService.findTmpUser(input.email);

        if(user) {
           throw new NotAcceptableException('E-Mail Adress already in use!');
        } else if(tmp) {
            try {
                const result = await this.mailerService.resendVerification(tmp);
                if(result.response) { 
                    return true; 
                }
                else { 
                    const error = new ServiceUnavailableException('Error: Sending confirmation email failed!'); 
                    console.log('An Error occured: ',error);
                    return error;
                }                
            } catch (error) { 
                console.log('An Error occured: ',error);
                return new InternalServerErrorException('Internal Server Error: Email could not be sent. Please report this to the administrator!'); 
            }
        } else {
            const password = await bcrypt.hash(input.password, 10);
            const result = await this.userService.create({...input, password: password});
            if(result) return true;
            return new InternalServerErrorException('Internal Server Error. Please try again later!');
        }      
    }

    /**
     * Check if email and password are correct
     */
    async validateUser({email, password}): Promise<User> {
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException('Email or Password incorrect');
        const valid = await bcrypt.compare(password, user.password);               
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
        console.log('Searching for email...');
        const user = await this.userService.findByEmail(email);
        if(!user){ 
            console.log('Email not found!');
            return false;
        }
        const payload = { firstName: user.firstName, userId: user._id };
        const result = this.mailerService.forgotPassword(email, this.jwtService.sign(payload));
        if(!result){ return false; }
        return true;
    }
}