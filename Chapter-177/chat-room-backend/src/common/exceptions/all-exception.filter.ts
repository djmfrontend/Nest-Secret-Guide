import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '未知错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      console.log(errorResponse);
      if (typeof errorResponse === 'object' && 'message' in errorResponse) {
        // 处理校验的返回的错误类型

        const messages = errorResponse.message;
        if (Array.isArray(messages)) {
          message = messages.join('; ');
        } else if (typeof messages === 'string') {
          message = messages;
        }
      } else if (typeof errorResponse === 'string') {
        message = errorResponse;
      }
    } else {
      console.error('未处理的异常:', exception);
      message = '服务器内部错误';
    }

    response.status(status).json({
      code: status,
      data: null,
      message: message,
      // 可选：开发环境显示堆栈信息
      // stack: process.env.NODE_ENV === 'development' ? (exception as any).stack : undefined,
    });
  }
}
