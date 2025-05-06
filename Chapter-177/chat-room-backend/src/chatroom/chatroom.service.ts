import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  async createOneToOne(userId: number, friendId: number) {
    const res = await this.prismaService.$transaction(async (tx) => {
      const { id } = await tx.chatRoom.create({
        data: {
          name: '聊天室' + Math.random().toString().slice(2, 8),
          type: false,
        },
        select: {
          id: true,
        },
      });
      await tx.userChatRoom.create({
        data: {
          userId,
          chatRoomId: id,
        },
      });
      await tx.userChatRoom.create({
        data: {
          userId: friendId,
          chatRoomId: id,
        },
      });
      return '创建成功';
    });

    return res;
  }

  async createGroupChatRoom(name: string, userId: number) {
    const { id } = await this.prismaService.chatRoom.create({
      data: {
        name,
        type: true,
      },
    });
    await this.prismaService.userChatRoom.create({
      data: {
        userId,
        chatRoomId: id,
      },
    });
    return '创建成功';
  }
  async list(userId: number) {
    // 查询用户加入的聊天室id
    const chatRoomIds = await this.prismaService.userChatRoom.findMany({
      where: {
        userId,
      },
      select: {
        chatRoomId: true,
      },
    });
    // 根据聊天室ID 查询对应的聊天室
    const chatRooms = await this.prismaService.chatRoom.findMany({
      where: {
        id: {
          in: chatRoomIds.map((item) => item.chatRoomId),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createdTime: true,
      },
    });
    const res: any[] = [];
    for (let i = 0; i < chatRooms.length; i++) {
      const userIds = await this.prismaService.userChatRoom.findMany({
        where: {
          chatRoomId: chatRooms[i].id,
        },
        select: {
          userId: true,
        },
      });
      res.push({
        ...chatRooms[i],
        userCount: userIds.length,
        userIds: userIds.map((item) => item.userId),
      });
    }
    return res;
  }
  async getMembers(chatRoomId: number) {
    const userIds = await this.prismaService.userChatRoom.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      select: {
        userId: true,
      },
    });

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        headPic: true,
        createdTime: true,
        email: true,
      },
    });
    return users;
  }
  async joinRoom(roomId: number, userId: number) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      select: {
        type: true,
      },
    });
    if (!room?.type) {
      throw new BadRequestException('一对一聊天室不能加人');
    }
    if (room) {
      await this.prismaService.userChatRoom.create({
        data: {
          userId,
          chatRoomId: roomId,
        },
      });
      return '加入成功';
    } else {
      throw new BadRequestException('聊天室不存在');
    }
  }

  async quit(roomId: number, userId: number) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room?.type) {
      throw new BadRequestException('一对一聊天室不能退出');
    }
    if (room) {
      await this.prismaService.userChatRoom.deleteMany({
        where: {
          userId,
          chatRoomId: roomId,
        },
      });
      return '退出成功';
    } else {
      throw new BadRequestException('聊天室不存在');
    }
  }
}
