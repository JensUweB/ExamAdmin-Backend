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
import { UmbrellaAssocModule } from './modules/umbrellaAssoc/umbrellaAssoc.module';
import { Config } from '../Config';

//dotenv.config();
@Module({
  imports: [
    UserModule,
    AuthModule,
    MartialArtsModule,
    ClubModule,
    ExamModule,
    ExamResultModule,
    UmbrellaAssocModule,
    GraphQLModule.forRoot(
      {
        autoSchemaFile: 'schema.gpl',
        installSubscriptionHandlers: true,
        context: ({req}) => ({req}),
        uploads: {
          maxFileSize:  Config.MAX_FILESIZE, // Default 5 MiB
          maxFiles: 5
        }
      }),
    MongooseModule.forRoot(Config.MONGO_CONN_STR),
    Config
    /* ConfigModule.forRoot({
      isGlobal: true,
    })  */ 
    ], 
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    Config
  ]
})
export class AppModule {}