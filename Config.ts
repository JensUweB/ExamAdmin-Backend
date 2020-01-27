/**
 * IMPORTANT! CHANGE CONFIG FILE BEVORE PRODUCTION DEPLOYMENT!
 * This config file was available for public on github. You need to change JWT_SECRET, or you will be at a high risc!
 * Don't forget a working email adress with ssl enabled for the server!
 */
export class Config {
    static PORT = 3000;
    static SMTP_HOST = "localhost";
    static SMTP_PORT = 25;
    static SMTP_SSL = false; // Turn this to true in an production environment. Don't forget the right port!
    static URL = "http://localhost:3000";
    static SERVER_EMAIL = "postmaster@localhost";
    static EMAIL_PASS = "123456@localhost"; // Password for your server email. Format: password@localhost
    static MONGO_CONN_STR = `mongodb://admin:admin%40p8x@127.0.0.1:27017/examadmin?authSource=admin&compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false`; // Your mongoDB connection string.
    static JWT_SECRET = `MIGrAgEAAiEAvwzN7rDBIe7D2kk3xIA6cKcDmLIc4uW3onudEG2be9ECAwEAAQIhALVc
    7Gl49f7GcLpZ40zxBYefuoRB1qC4PEH7ew2GGdOBAhEA/fu1sPvBYEE965VfIdKM2QIRAMCRKm2b8JnHCMt1298da
    7kCEBiY5wjD6P90chW9up/g70kCEFfOGXWPRF8qJTV40T/kD2kCEQCgk8BL1FMeyjD6Nbl7IJX7`;
    static JWT_EXPIRE = 7200; // Token expiration in seconds. Longer than 4 hours (14400 seconds) is NOT RECOMMENDED. Does affect password reset token too!
    static MAX_FILESIZE = 5242880; // The maximum upload file size in bytes. Default: 5MiB
}