import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { environment } from 'environment';


/**
 * Normal server startup
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    // Include app module, with all necessary modules for the project
    AppModule
  );
  app.useStaticAssets(join(__dirname, '/uploads'));
  app.setBaseViewsDir(join(__dirname, '/views'));
  app.setViewEngine('hbs');
  app.enableCors(/* {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
} */);
  await app.listen( process.env.PORT || environment.PORT || 3000);
}
bootstrap();
