import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtUserData } from './types/jwt';
export const RequireLogin = () => SetMetadata('require-login', true);

export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    const user = request.user;
    return data ? user[data as keyof JwtUserData] : user;
  },
);
