import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as Express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { environment } from 'environment';

const server = Express();

/**
 * Normal server startup
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server)); // ExpressAdapter required in order to work in google cloud

  app.useStaticAssets(join(__dirname, '/uploads'));
  app.setBaseViewsDir(join(__dirname, '/views'));
  app.setViewEngine('hbs');
  app.enableCors();
  await app.listen( environment.PORT || 3000);
}
bootstrap();
