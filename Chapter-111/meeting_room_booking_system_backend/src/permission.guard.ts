import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user) {
      return true;
    }
    // 接下来请求里会带上角色和权限

    const permission = request.user.permissions;

    // 我们只需要在控制层标注需要通过的权限 就可以对接口进行拦截

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions) {
      return true;
    }
    for (let i = 0; i < requiredPermissions.length; i++) {
      //
      const curPermission = requiredPermissions[i];
      const found = permission.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
