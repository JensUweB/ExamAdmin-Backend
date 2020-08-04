import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { UserInput } from '../user/input/user.input';
import { v4 } from 'uuid';
import {
  Injectable,
  Inject,
  forwardRef,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TmpUser } from '../user/interfaces/tmpuser.interface';
import { environment } from 'environment';

@Injectable()
export class MailerService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async sendVerification(userInput: UserInput) {
    //setup unique verification link with uuid and ioredis
    const id = v4();
    const link = environment.URL + '/auth/confirm/' + id;

    //setup email data
    let mailOptions = {
      from: environment.SERVER_EMAIL,
      to: userInput.email,
      subject: 'Verification',
      text: `Hello ${userInput.firstName} ${userInput.lastName}, welcome to our awesome examAdmin! Please click on the following link, to confirm registration: ${link}"`,
      html: `<b>Hello ${userInput.firstName} ${userInput.lastName}</b>,
                <br> welcome to our awesome examAdmin!<br>
                Please click on the following link, to confirm registration: <a href="${link}">Confirm</a><br>
                This was not you? No worries. This link expires within 24 hours.<br>
                Maybe you should change your email account password, just to be safe.<br>`,
    };
    //send email
    const result = await this.sendMail(mailOptions);
    return id;
  }

  async resendVerification(tmpUser: TmpUser): Promise<Boolean | any> {
    console.log('[MailerService] Trying to resend verification mail...');
    const link = environment.URL + '/auth/confirm/' + tmpUser.uuid;
    //setup email data
    let mailOptions = {
      from: environment.SERVER_EMAIL,
      to: tmpUser.user.email,
      subject: 'Verification (Resend)',
      text: `Hello ${tmpUser.user.firstName} ${tmpUser.user.lastName}, welcome to our awesome examAdmin! Please click on the following link, to confirm registration: ${link}"`,
      html: `<b>Hello ${tmpUser.user.firstName} ${tmpUser.user.lastName}</b>,
                <br> welcome to our awesome examAdmin!<br>
                Please click on the following link, to confirm registration: <a href="${link}">Confirm</a><br>
                This was not you? No worries. This link expires within 24 hours.<br>
                Maybe you should change your email account password, just to be safe.<br>`,
    };
    //send email
    const result = await this.sendMail(mailOptions);
    return result;
  }

  async forgotPassword(email: string, token) {
    const user = await this.userService.findByEmail(email);
    if (!user) return false;
    const url: string = environment.frontendUrl + '/auth/password-reset/' + token;

    //setup email data
    let mailOptions = {
      from: environment.SERVER_EMAIL,
      to: email,
      subject: 'Password help has arived!',
      text:
        'Sorry, seems you disabled html view... Your password reset help is here! If you want to reset your password, klick on this Link: ' +
        url,
      template: 'forgot-password',
      context: {
        name: user.firstName + ' ' + user.lastName,
        url: url,
      },
    };
    //send email
    this.sendMail(mailOptions);
  }

  async passwordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return false;

    //setup email data
    let mailOptions = {
      from: environment.SERVER_EMAIL,
      to: email,
      subject: 'Password Reset Confirmation',
      text: 'You have reset your password. Good for you!',
      template: 'reset-password',
      context: {
        name: user.firstName + ' ' + user.lastName,
      },
    };
    //send email
    this.sendMail(mailOptions);
  }

  async sendMail(mailOptions) {
    //setup smtp config
    var smtpConfig = {
      host: environment.SMTP.HOST,
      port: environment.SMTP.PORT,
      secure: environment.SMTP.SSL, // use SSL
      auth: {
        user: environment.SMTP.USER,
        pass: environment.SMTP.PASS,
      },
    };

    //create transporter object
    let transporter = nodemailer.createTransport(smtpConfig);

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.hbs',
          partialsDir: 'src/modules/auth/templates',
          layoutsDir: 'src/modules/auth/templates',
          defaultLayout: 'email.hbs',
        },
        viewPath: 'src/modules/auth/templates',
        extName: '.hbs',
      }),
    );

    try {
      return transporter.sendMail(mailOptions);
    } catch (error) {
      console.log('[MailerService] Unexpected Server Error: ', error);
      throw error;
    }
  }
}
