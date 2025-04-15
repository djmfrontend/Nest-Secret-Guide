import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('getHELLO');
    return this.appService.getHello();
  }
  @UseGuards(LoginGuard)
  @Get('aaa')
  aaa(): string {
    return 'aaa';
  }
  @UseInterceptors(TimeInterceptor)
  @Get('bbb')
  bbb(): string {
    return 'bbb';
  }
}
