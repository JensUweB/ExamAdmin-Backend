/**
 * IMPORTANT! CHANGE CONFIG FILE BEVORE PRODUCTION DEPLOYMENT!
 * This config file was available for public on github. You need to change JWT_SECRET, or you will be at a high risc!
 * Don't forget a working email adress with ssl enabled for the server!
 */
export class Config {
    static PORT = 3000;
    static SMTP_HOST = "localhost";
    static SMTP_PORT = 25;
    static SMTP_SSL = false;
    static URL = "http://localhost:3000";
    static SERVER_EMAIL = "postmaster@localhost";
    static EMAIL_PASS = "123456@localhost"; // Password for your server email. Format: password@localhost
    static MONGO_CONN_STR = `your-connection-string-goes-here`; // Your mongoDB connection string.
    static JWT_SECRET = `MIGrAgEAAiEAvwzN7rDBIe7D2kk3xIA6cKcDmLIc4uW3onudEG2be9ECAwEAAQIhALVc
    7Gl49f7GcLpZ40zxBYefuoRB1qC4PEH7ew2GGdOBAhEA/fu1sPvBYEE965VfIdKM2QIRAMCRKm2b8JnHCMt1298da
    7kCEBiY5wjD6P90chW9up/g70kCEFfOGXWPRF8qJTV40T/kD2kCEQCgk8BL1FMeyjD6Nbl7IJX7`;
    static JWT_EXPIRE = 3600; // Token expiration in seconds. Longer than 4 hours (14400 seconds) is NOT RECOMMENDED. Does affect password reset token too!
    static MAX_FILESIZE = 10485760; // The maximum upload file size in bytes. Default: 10MiB
}