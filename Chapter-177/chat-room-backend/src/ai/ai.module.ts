import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [],
})
export class AiModule {}
