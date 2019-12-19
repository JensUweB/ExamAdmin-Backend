import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Check if email and password are correct
     */
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && user.password === pass) {
            return user;
        }
        return null;
    }

    /**
     * After validating, this will return an access token for you
     */
    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const result = { access_token: this.jwtService.sign(payload) };

        //console.log(user.email + ' | '+ user.id);
        //console.log(user);

        const authModel = new AuthModel();
        authModel.token = result.access_token;
        authModel.tokenExpireDate = new Date(Date.now() + 1000*60*60 + 1000*3600);
        authModel.user = user;
        return authModel;
    }
}