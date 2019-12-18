import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

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
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * After validating, this will return an access token for you
     */
    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
}