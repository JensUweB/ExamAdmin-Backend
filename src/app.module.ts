import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { MartialArtsModule } from './modules/martialArts/martialArts.module';
import { ClubModule } from './modules/club/club.module';
import { ExamModule } from './modules/exam/exam.module';
import { ExamResultModule } from './modules/examResult/examResult.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MartialArtsModule,
    ClubModule,
    ExamModule,
    ExamResultModule,
    GraphQLModule.forRoot(
      {
        autoSchemaFile: 'schema.gpl',
        installSubscriptionHandlers: true,
        context: ({req}) => ({req})
      }),
      /* MailerModule.forRoot({
        transport: 'smtps://postmaster@localhost:123456@localhost',
        defaults: {
          from:'"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }), */
    MongooseModule.forRoot(`mongodb://admin:admin%40p8x@127.0.0.1:27017/examadmin?authSource=admin&compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false`),
    ], 
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}