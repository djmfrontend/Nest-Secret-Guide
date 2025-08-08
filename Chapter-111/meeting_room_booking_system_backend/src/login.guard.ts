import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { JwtUserData } from './types/jwt';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //如果某个路由需要登录保护，开发者可能会在路由配置或组件类上使用一个装饰器（如@RequireLogin）来标记这一点。
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getClass(), context.getHandler()],
    );
    console.log(requireLogin);
    if (!requireLogin) {
      // 如果不包含这个装饰器 直接过
      return true;
    }
    const authorization = request.headers['authorization'];
    if (!authorization) {
      // 有装饰器 带没有
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('toen 失效,请重新登录');
    }
  }
}
