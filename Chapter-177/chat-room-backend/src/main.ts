import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // 参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // 响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 9008);
}
bootstrap();
