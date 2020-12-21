FROM node:12
ENV DEBIAN_FRONTEND=noninteractive
ENV PORT=80
ENV production=true
ENV userConfirmation=false
ENV host='0.0.0.0'
ENV protocol='http'
ENV frontendUrl='http://localhost:8081'
ENV serverEmail='info@mail.local'
ENV smtpHost='in-v3.mailjet.com'
ENV smtpPort=25
ENV smtpSsl=true
ENV smtpUser='any'
ENV smtpPass='123456'
ENV mongoConnStr='mongodb+srv://Admin:123456@localhost/examadmin?retryWrites=true&w=majority'
ENV jwtSecret='superSecretKey1234'
ENV jwtExpire=7200
ENV maxFileSize=5242880
LABEL maintainer="jens.becker@root-itsolutions.de"
LABEL version="0.3.5"
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm","run","start:prod"]
