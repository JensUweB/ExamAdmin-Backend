FROM node:12
ENV DEBIAN_FRONTEND=noninteractive
ENV port=80
ENV production=true
ENV url='https://backend.root-itsolutions.de'
ENV frontendUrl='https://app.root-itsolutions.de'
ENV serverEmail='info@root-itsolutions.de'
ENV smtpHost='in-v3.mailjet.com'
ENV smtpPort=25
ENV smtpSsl=true
ENV smtpUser='9e00d7ba03b81f901c0e03cc37bd1449'
ENV smtpPass='f9c68fa8656f3b5b93cb4d4ca0581366'
ENV mongoConnStr='mongodb+srv://Admin:NrKG9DkvgHhpm5Jm@examadmin-livetest-tmvty.gcp.mongodb.net/examadmin?retryWrites=true&w=majority'
ENV jwtSecret='MIGrAgEAAiEAvwzN7rDBIe7D2kk3xIA6cKcDmLIc4uW3onudEG2be9ECAwEAAQIhALVc7Gl49f7GcLpZ40zxBYefuoRB1qC4PEH7ew2GGdOBAhEA/fu1sPvBYEE965VfIdKM2QIRAMCRKm2b8JnHCMt1298da7kCEBiY5wjD6P90chW9up/g70kCEFfOGXWPRF8qJTV40T/kD2kCEQCgk8BL1FMeyjD6Nbl7IJX7'
ENV jwtExpire=7200
ENV maxFileSize=5242880
LABEL maintainer="jens.becker@root-itsolutions.de"
LABEL version="0.1"
RUN apt-get update -y && apt-get install -y git
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm","run","start:prod"]