export class environment {
    static PORT=3000;
    static URL="http://api.localhost:3000";
    static frontendUrl="http://app.localhost.net";
    static SERVER_EMAIL="info@localhost.net";
    static SMTP = {
        HOST:"smtp.localhost.net",
        PORT:587,
        SSL:false,
        USER:"myDefaultUser",
        PASS:"SuperSecretPassword"
    };
    static MONGO_CONN_STR="mongodb://localhost:27017/examadmin?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
    static JWT_SECRET="MIGrAgEAAiEAvwzN7rDBIe7D2kk3xIA6cKcDmLIc4uW3onudEG2be9ECAwEAAQIhALVc7Gl49f7GcLpZ40zxBYefuoRB1qC4PEH7ew2GGdOBAhEA/fu1sPvBYEE965VfIdKM2QIRAMCRKm2b8JnHCMt1298da7kCEBiY5wjD6P90chW9up/g70kCEFfOGXWPRF8qJTV40T/kD2kCEQCgk8BL1FMeyjD6Nbl7IJX7";
    static JWT_EXPIRE=7200;
    static MAX_FILESIZE=5242880;
    static enableClubs=false;
}