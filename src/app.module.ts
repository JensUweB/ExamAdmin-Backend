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
import { Config } from 'Config';

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
        context: ({req}) => ({req}),
        uploads: {
          maxFileSize: Config.MAX_FILESIZE, // 10 MiB
          maxFiles: 5
        }
      }),
      /* ServeStaticModule.forRoot({
        rootPath: join(__dirname, './doc'),   // <-- path to the static files
      }), */
    MongooseModule.forRoot(Config.MONGO_CONN_STR),
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