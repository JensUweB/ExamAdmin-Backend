import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  @Get('auth/confirm/:uuid')
  async getUserConfirm(@Param('uuid') uuid: string) {
    const user = await this.userService.findByConfirmId(uuid);
    if (!user) return "<h2>Confirmation Failed!</h2><br>Sorry, could not find an user with the given uuid.<br>Maybe you clicked an expired link!";
    const result = await this.userService.addUser(user.user, user._id);
    if (result) return "<h2>Confirmation successfull!</h2><br>Welcome, " + result.firstName + "!";
    return "<h2>Sorry, some unexpected error occured!</h2>";
  }

  @Get('auth/forgot-password/:token')
  async forgotPassword(@Param('token') token: string) {
    const result = await this.jwtService.verify(token);

    return `
    <div>
      <h1>Forgot your password?</h1>
      <p>Never mind. We got you covered.</p>
      <p><b>Is this your email adress?</b><br>${result.email}</p>
      <div>
        <form method="POST" action="/auth/forgot-password/">
          <div>New Password <input type="password" name="password"></div>
          <div><input type="submit"></div>
          <input type="hidden" value="${token}" name="token">
        </form>
      </div>
    </div>`;
  }

  @Post('auth/forgot-password/')
  async resetPassword(@Body() body) {
    let result: any;
    try {
      result = this.jwtService.verify(body.token);

      const hashPw = await bcrypt.hash(body.password, 10);
      const user = await this.userService.findByEmail(result.email);
      if (!user) return `<h1>ERROR: User not found. Invalid email adress!`;
      const res = await this.userService.updatePassword(user._id, hashPw);
      if (!res) return `<h1>ERROR: Unexpected Server Error! Try again later.</h1>`;

      return `
      <div>
        <h2>Password reset was successful!</h2>
        <b>We have send you an confirmation email.<br> Just close this window and login with your new password! </b>
      </div>
      `
    } catch (error) {
      if(error.name == "TokenExpiredError") return `<h1>Your password reset token is expired.</h1><b> Please repeat password reset process.</b>`;
      return `<h1>Unexpected ${error.name}</h1><b>${error.message}</b>`;
    }
  }
}
