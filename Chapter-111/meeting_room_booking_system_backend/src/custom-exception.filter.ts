import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();
    response
      .json({
        code: exception.getStatus(),
        message: exception.message || '服务器异常',
        data: exception.getResponse(),
      })
      .end();
  }
}
