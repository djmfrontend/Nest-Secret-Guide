import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject('person')
  private person;

  @Get()
  getHello(): string {
    console.log(this.person);
    return this.appService.getHello();
  }
}
