import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Config } from '../Config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, 'upload'));
  app.setBaseViewsDir(join(__dirname, '/views'));
  app.setViewEngine('hbs');

  await app.listen(Config.PORT);
}
bootstrap();
