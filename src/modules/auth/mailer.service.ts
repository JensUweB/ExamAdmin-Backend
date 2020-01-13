var Redis = require("ioredis");
import * as nodemailer from 'nodemailer';
import { UserInput } from '../user/input/user.input';
import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {

    constructor() {}

    async sendVerification(userInput: UserInput) {
        //setup unique verification link with uuid and ioredis
        const id = v4();
        //const redis = new Redis();
        //await redis.set(id, userId, "ex", 60*60*24);
        const link = 'http://localhost:3000/user/confirm/'+id
        console.log(link);

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
        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log('[Nodemailer] '+error);
                return error;
            }
            //console.log('[Nodemailer] Email sent: '+JSON.stringify(info));
        });
        return id; 
    }
}