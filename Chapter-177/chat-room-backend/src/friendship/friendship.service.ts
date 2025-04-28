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
}
