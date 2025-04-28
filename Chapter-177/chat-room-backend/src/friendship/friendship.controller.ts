import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { FriendAddDto } from './dto/friend-add.dto';
import { JwtUserData } from 'src/auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('add')
  @RequireLogin()
  async add(@UserInfo() user: JwtUserData, @Body() friendAddDto: FriendAddDto) {
    return await this.friendshipService.addFriendship(
      user.userId,
      friendAddDto,
    );
  }

  @Get('request_list')
  @RequireLogin()
  async list(@UserInfo() user: JwtUserData) {
    return await this.friendshipService.getFriendRequestList(user.userId);
  }

  @Get('agree/:id')
  async agree(@Param('id') id: string) {
    //./ TODO: 同意id好友请求
    // return await this.friendshipService.agreeFriendRequest(id);
  }
  @Get('reject/:id')
  async reject(@Param('id') id: string) {
    //./ TODO: 拒绝id好友请求
    // return await this.friendshipService.rejectFriendRequest(id);
  }
}
