import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'person',
      useFactory() {
        return {
          name: 'zhangsan',
          age: 18,
        };
      },
    },
    {
      provide: 'person2',
      useFactory(person: { name: string }, appService: AppService) {
        return {
          name: person.name,

          desc: appService.getHello(),
        };
      },
      inject: ['person', AppService],
    },
    {
      provide: 'person3',
      async useFactory() {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });
        console.log('person3');
        return {
          name: 'lisi',
          desc: 'ccc',
        };
      },
    },
  ],
})
export class AppModule {}
