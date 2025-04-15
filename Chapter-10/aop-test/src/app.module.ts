import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogMiddleware } from './log.middleware';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: LoginGuard, // 如果需要在别的位置用到这个Guard，那么可以在这里注册
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('aaa', 'aaa/*path');
  }
}
