import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { User } from '../user/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
    ) { }

    /**
     * Check if email and password are correct
     */
    async validateUser({email, password}): Promise<User | any> {
        const user = await this.userService.findByEmail(email);
        if(!user) return Error('Email or password incorrect');
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return Error('Email or password incorrect');
        return user;
    }

    /**
     * After validating, this will return an access token for you
     */
    async login(user: any) {
        const payload = { firstName: user.firstName, userId: user._id };
        const result = this.jwtService.sign(payload);
        const authModel = new AuthModel();
        authModel.token = result;
        authModel.tokenExpireDate = new Date(Date.now() + 1000*60*60 + 1000*3600);
        authModel.user = user;

        return authModel;
    }

    async changePassword(id: string, password: string): Promise<Boolean> {
        const user = await this.userService.findById(id);

        if(!user) return false;
        const hashPw = await bcrypt.hash(password, 10);
        const result = await this.userService.updatePassword(id, hashPw);

        if(result) return true;
        return false;
    }

    async forgotPassword(email: string): Promise<String> {
        const user = await this.userService.findByEmail(email);
        if(!user) return "Error: Email not found!";
        const result = this.mailerService.forgotPassword(email, this.jwtService.sign({email: email}));
        if(!result) return "Error: Unexpected Server Error!";
        return "Success: Email sent!";
    }
}