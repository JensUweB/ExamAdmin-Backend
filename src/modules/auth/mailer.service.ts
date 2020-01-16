var Redis = require("ioredis");
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { UserInput } from '../user/input/user.input';
import { v4 } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Config } from 'Config';

@Injectable()
export class MailerService {

    constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

    async sendVerification(userInput: UserInput) {
        //setup unique verification link with uuid and ioredis
        const id = v4();
        const link = Config.URL+'/auth/confirm/'+id
        
        //setup email data
        let mailOptions = {
            from: Config.SERVER_EMAIL, 
            to: userInput.email,
            subject: 'Test',                           
            text: `Hello ${userInput.firstName} ${userInput.lastName}, welcome to our awesome examAdmin! Please click on the following link, to confirm registration: ${link}"`,
            html: `<b>Hello ${userInput.firstName} ${userInput.lastName}</b>,
                <br> welcome to our awesome examAdmin!<br>
                Please click on the following link, to confirm registration: <a href="${link}">Confirm</a><br>
                This was not you? No worries. This link expires within 24 hours.<br>
                Maybe you should change your email account password, just to be safe.<br>`
        }
        //send email
        this.sendMail(mailOptions);
        return id; 
    }

    async forgotPassword(email: string, token) {
        const user = await this.userService.findByEmail(email);
        if(!user) return false;
        const url: string = Config.URL+'/auth/forgot-password/'+token;

        //setup email data
        let mailOptions = {
            from: Config.SERVER_EMAIL, 
            to: email,
            subject: 'Password help has arived!',  
            text: 'Sorry, seems you disabled html view... Your password reset help is here! If you want to reset your password, klick on this Link: '+url,
            template: 'forgot-password',
            context: {
                name: user.firstName + " " + user.lastName,
                url: url
            }
        }
        //send email
        this.sendMail(mailOptions);
    }

    async passwordReset(email: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) return false;

        //setup email data
        let mailOptions = {
            from: Config.SERVER_EMAIL, 
            to: email,
            subject: 'Password Reset Confirmation',           
            text: 'You have reset your password. Good for you!',                
            template: 'reset-password',
            context: {
                name: user.firstName + " " + user.lastName
            }
        }
        //send email
        this.sendMail(mailOptions);
    }

    async sendMail(mailOptions) {
        //setup smtp config
        var smtpConfig = {
            host: Config.SMTP_HOST,
            port: Config.SMTP_PORT,
            secure: Config.SMTP_SSL, // use SSL
            auth: {
                user: Config.SERVER_EMAIL,
                pass: Config.EMAIL_PASS
            }
        };

        //create transporter object
        let transporter = nodemailer.createTransport(smtpConfig);
        
        transporter.use('compile',hbs({
            viewEngine: {
                extName: '.hbs',
                partialsDir: 'src/modules/auth/templates',
                layoutsDir: 'src/modules/auth/templates',
                defaultLayout: 'email.hbs',
                },
                viewPath: 'src/modules/auth/templates',
                extName: '.hbs',
        }));
    

        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log('[Nodemailer] '+error);
                return error;
            } else return null;
        });
    }
}