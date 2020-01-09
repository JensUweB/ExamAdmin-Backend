import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { User } from '../user/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Check if email and password are correct
     */
    async validateUser({email, password}): Promise<User> {
        const user = await this.userService.findByEmail(email);
        const valid = await bcrypt.compare(password, user.password);

        if(!valid || !user){
            throw Error('Email or password incorrect');
        }
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
}