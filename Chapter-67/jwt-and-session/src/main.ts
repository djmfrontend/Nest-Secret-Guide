import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'nestjs',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(process.env.PORT ?? 9008);
}
bootstrap();
