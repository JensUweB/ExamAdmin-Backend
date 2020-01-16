import { Controller, Get, Param, Post, Body, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as hbs from 'hbs';
import { Response } from 'express';

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
  async forgotPassword(@Res() res: Response, @Param('token') token: string) {
    const result = await this.jwtService.verify(token);

    return res.render(
      'forgot-password',
      {
        email: result.email,
        token: token
      }
    );
  }

  @Post('auth/forgot-password/')
  async resetPassword(@Body() body, @Res() res: Response) {
    let result: any;
    try {
      result = this.jwtService.verify(body.token);

      const hashPw = await bcrypt.hash(body.password, 10);
      const user = await this.userService.findByEmail(result.email);
      if (!user) return `<h1>ERROR: User not found. Invalid email adress!`;
      const userRes = await this.userService.updatePassword(user._id, hashPw);
      if (!userRes) return `<h1>ERROR: Unexpected Server Error! Try again later.</h1>`;
      
      return res.render(
        'index',
        {
          body: `<div>
          <h2>Password reset was successful!</h2>
          <b>We have send you an confirmation email.<br> Just close this window and login with your new password! </b>
        </div> `
        }
      );
      
    } catch (error) {
      if (error.name == "TokenExpiredError") return `<h1>Your password reset token is expired.</h1><b> Please repeat password reset process.</b>`;
      return `<h1>Unexpected ${error.name}</h1><b>${error.message}</b>`;
    }
  }
}
