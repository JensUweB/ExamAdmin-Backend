FROM node:12
ENV DEBIAN_FRONTEND=noninteractive
ENV port=3000
ENV url='http://localhost:3000'
ENV frontendUrl='http://localhost:4200'
ENV serverEmail='postmaster@localhost'
ENV smtpHost='localhost'
ENV smtpSsl=false
ENV smtpUser='postmaster'
ENV smtpPass='123456'
ENV mongoConnStr='mongodb://localhost:27017/examadmin?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
ENV jwtSecret='dhL5xAoSafcyBKoCL8NAS8'
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