import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { Config } from 'Config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '/uploads'));
  app.setBaseViewsDir(join(__dirname, '/views'));
  app.setViewEngine('hbs');
  app.enableCors();
  await app.listen(Config.PORT || 3000);
}
bootstrap();
