import { Helper } from "src/modules/helpers/helper.class";

export class environment {
  static PRODUCTION = Helper.getBoolean(process.env.production) || false;
  static PORT = process.env.port || 3000;
  static URL = process.env.url || 'http://localhost:3000';
  static frontendUrl = process.env.frontendUrl || 'http://localhost:4200';
  static SERVER_EMAIL = process.env.serverEmail || 'postmaster@localhost';
  static SMTP = {
    HOST: process.env.smtpHost || 'localhost',
    PORT: process.env.smtpPort || 2500,
    SSL: process.env.smtpSsl || false,
    USER: process.env.smtpUser || 'postmaster',
    PASS: process.env.smtpPass || '123456',
  };
  static MONGO_CONN_STR = process.env.mongoConnStr || 
    'mongodb://localhost:27017/examadmin?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
  static JWT_SECRET = process.env.jwtSecret || 
    'dhL5xAoSafcyBKoCL8NAS8rFyoSmSSR6S4KLLaH7jJTF7g';
  static JWT_EXPIRE = process.env.jwtExpire || 7200;
  static MAX_FILESIZE = process.env.maxFileSize || 5242880;
  static enableClubs = false;
}
