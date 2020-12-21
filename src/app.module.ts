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
import { environment } from 'environment';

// dotenv.config();
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
        debug: !environment.PRODUCTION, // disable debug mode on production
        playground: !environment.PRODUCTION, // disable playground on production
        autoSchemaFile: 'schema.gpl',
        installSubscriptionHandlers: true,
        context: ({req}) => ({req}),
        uploads: {
          maxFileSize: +environment.MAX_FILESIZE, // Default 5 MiB
          maxFiles: 5,
        },
        cors: {
          origin: environment.frontendUrl,
          credentials: true,
        },
      }),
    MongooseModule.forRoot( environment.MONGO_CONN_STR),
    /* ConfigModule.forRoot({
      isGlobal: true,
    })  */
    ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
}
