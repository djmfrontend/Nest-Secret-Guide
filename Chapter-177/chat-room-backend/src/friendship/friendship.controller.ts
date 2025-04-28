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
}
