var Redis = require("ioredis");
import * as nodemailer from 'nodemailer';
import { UserInput } from '../user/input/user.input';
import { v4 } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class MailerService {

    constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

    async sendVerification(userInput: UserInput) {
        //setup unique verification link with uuid and ioredis
        const id = v4();
        const link = 'http://localhost:3000/auth/confirm/'+id
        
        //setup email data
        let mailOptions = {
            from: 'postmaster@localhost', 
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
        const  name: string = user.firstName.toString + " " + user.lastName;
        const url: string = 'http://localhost:3000/auth/forgot-password/'+token;

        //setup email data
        let mailOptions = {
            from: 'postmaster@localhost', 
            to: email,
            subject: 'Password help has arived!',  
            text: `No plain text available.`,                         
            html: `
                    <h3>Dear ${name},</h3>
                    <p>You requested for a password reset, kindly use this <a href="${url}">link</a> to reset your password</p>
                    <br>
                    <p>This link contains a security token. The token will expire after one hour!</p>
                    <br>
                    <p>Cheers!</p>`
        }
        //send email
        this.sendMail(mailOptions);
    }

    async passwordReset(email: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) return false;

        const id = v4();

        //setup email data
        let mailOptions = {
            from: 'postmaster@localhost', 
            to: email,
            subject: 'Password Reset Confirmation',                           
            template: 'reset-password.email',
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
            host: 'localhost',
            port: 25,
            secure: false, // use SSL
            auth: {
                user: 'postmaster@localhost',
                pass: '123456@localhost'
            }
        };

        //create transporter object
        let transporter = nodemailer.createTransport(smtpConfig);

        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log('[Nodemailer] '+error);
                return error;
            } else return null;
        });
    }
}