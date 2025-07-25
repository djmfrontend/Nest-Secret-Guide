import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { OssModule } from './oss/oss.module';
import { ChatModule } from './chat/chat.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RedisModule,
    EmailModule,

    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: 'djm',
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),

    FriendshipModule,

    ChatroomModule,

    OssModule,

    ChatModule,

    ChatHistoryModule,

    AiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
