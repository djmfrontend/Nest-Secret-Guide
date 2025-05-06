import { Inject, Injectable } from '@nestjs/common';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

import { FriendAddDto } from './dto/friend-add.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  async addFriendship(id: number, friendAddDto: FriendAddDto) {
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: id,
        toUserId: friendAddDto.friendId,
        status: 0,
        reason: friendAddDto.reason,
      },
    });
  }
  async getFriendRequestList(userId: number) {
    return await this.prismaService.friendRequest.findMany({
      where: {
        status: 0,
        fromUserId: userId,
      },
    });
  }
  async agreeFriendRequest(userId: number, friendId: number) {
    // 先更新申请列表的状态

    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });
    const res = await this.prismaService.friendship.findMany({
      where: {
        userId: userId,
        friendId: friendId,
      },
    });
    if (res.length > 0) {
      return res;
    } else {
      return await this.prismaService.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
        },
      });
    }
  }
  async rejectFriendRequest(userId: number, friendId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
  }
}
