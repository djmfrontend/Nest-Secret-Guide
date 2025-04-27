import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
export const RequireLogin = () => SetMetadata('require-login', true);

/**
 * createParamDecorator 用于创建自定义的参数装饰器。这些装饰器可以被用在控制器方法的参数中
 * 类似于 @Body()、@Query() 或 @Param() 等内置装饰器。
 *  data 这是传递给装饰器的参数。如果在使用装饰器时没有传递参数，则 data 为 undefined。
 * context这是一个 ExecutionContext 对象，包含了当前请求的上下文信息。
 *
 *
 */
/**
 * 获取token - user 信息
 */
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
