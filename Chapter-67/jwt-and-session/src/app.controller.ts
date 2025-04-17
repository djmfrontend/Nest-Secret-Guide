import {
  Controller,
  Get,
  Header,
  Headers,
  Inject,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('sss')
  getTest(@Session() session: Record<string, any>): number {
    console.log(session.count);
    session.count = session.count ? session.count + 1 : 1;
    // session.visits = session.visits ? session.visits + 1 : 1;

    return session.count;
  }
  @Inject(JwtService)
  private jwtService: JwtService;
  @Get('ttt')
  ttt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);

        const newToken = this.jwtService.sign({
          count: data.count + 1,
        });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1,
      });

      response.setHeader('token', newToken);
      return 1;
    }
  }
}
