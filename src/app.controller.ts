import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './modules/user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user/confirm/:uuid')
  async getUserConfirm(@Param('uuid') uuid: string) {
    const user = await this.userService.findByConfirmId(uuid);
    if(!user) return "<h2>Confirmation Failed!</h2><br>Sorry, could not find an user with the given uuid.<br>Maybe you clicked an expired link!";
    const result = await this.userService.addUser(user.user, user._id);
    if(result) return "<h2>Confirmation successfull!</h2><br>Welcome, "+result.firstName+"!";
    return "<h2>Sorry, some unexpected error occured!</h2>";
  }
}
