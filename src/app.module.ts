import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    GraphQLModule.forRoot(
      {autoSchemaFile: 'schema.gpl'}),
    MongooseModule.forRoot(`mongodb://admin:admin%40p8x@127.0.0.1:27017/examadmin?authSource=admin&compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false`)], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
