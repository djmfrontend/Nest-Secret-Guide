import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';
import { LoginGuard } from './login.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
    console.log('Response...');
  });
  // app.useGlobalGuards(new LoginGuard());
  await app.listen(process.env.PORT ?? 9005);
}
bootstrap();
