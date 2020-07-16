FROM node:12
ENV DEBIAN_FRONTEND=noninteractive
LABEL maintainer="jens.becker@root-itsolutions.de"
LABEL version="0.1"
RUN apt-get update -y && apt-get install -y git
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","run","start:prod"]