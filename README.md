<h1 align="center">ExamAdmin Backend </h1>
  
  <p align="center">Build with <a href="http://nestjs.com">NestJS</a> - a progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
   <p align="center">

## Description

This backend was build for easy management and contribution of martial arts clubs. It supports different martial arts from different styles, multible clubs and even umbrella associations. Every user can be part of multible clubs and umbrella associations and can have multible martial arts assigned.

A graphQL api is provided.

## Requirements
* A NoSQL Database - mongodb is recommended (A local mongodb instance for development is recommended)
* A working email account for sending emails to users (I use <a href="https://mailslurper.com/">mailslurper</a> for development)

## Installation

```bash
$ npm install
```
* Go to the project root folder and open "Config.ts" file
* Change the values to your needs. 
* Please change JWT_SECRET in Config.ts bevore production deployment!

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests (currently no unit test included)
$ npm run test

# e2e tests (you should run this to see, if everything works)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author of this project - [Jens Uwe Becker](https://root-itsolutions.de)

## License

  Nest is [MIT licensed](LICENSE).
