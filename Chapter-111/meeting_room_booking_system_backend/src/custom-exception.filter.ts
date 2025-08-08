import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();
    // 处理 校验带来的 问题
    const res = exception.getResponse() as { message: string[] };
    console.log(res.message);
    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data:
          res.message && Array.isArray(res.message)
            ? res.message?.join(',')
            : res.message || exception.message,
      })
      .end();
  }
}
