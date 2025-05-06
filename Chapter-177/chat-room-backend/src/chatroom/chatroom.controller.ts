import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('create-one-to-one')
  @RequireLogin()
  async createOneToOne(
    @Query('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    console.log('friendId', friendId, 'userId', userId);
    if (!friendId) {
      throw new BadRequestException('friendId is required');
    }
    return await this.chatroomService.createOneToOne(userId, friendId);
  }

  @Get('list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return await this.chatroomService.list(userId);
  }
}
