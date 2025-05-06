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

  // 查询聊天室所有用户
  @Get('members')
  async members(@Query('chatRoomId') chatRoomId: number) {
    return await this.chatroomService.getMembers(chatRoomId);
  }

  // 加入群聊  邀请 房间ID 被加入者ID
  @Get('join/:id/:userId')
  async join(@Param('id') id: number, @Param('userId') userId: number) {
    return await this.chatroomService.joinRoom(id, userId);
  }
  // 退出群聊
  @Get('quit/:id/:userId')
  async quit(@Param('id') id: number, @Param('userId') userId: number) {
    return await this.chatroomService.quit(id, userId);
  }
}
