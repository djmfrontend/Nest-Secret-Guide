import { Inject, Injectable } from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDto } from './dto/history-chat.dto';
@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  async list(chatRoomId: number) {
    return await this.prismaService.chatHistory.findMany({
      where: {
        chatRoomId,
      },
    });
  }
  async add(chatRoomId: number, history: HistoryDto) {
    return await this.prismaService.chatHistory.create({
      data: history,
    });
  }
  create(createChatHistoryDto: CreateChatHistoryDto) {
    return 'This action adds a new chatHistory';
  }

  findAll() {
    return `This action returns all chatHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatHistory`;
  }

  update(id: number, updateChatHistoryDto: UpdateChatHistoryDto) {
    return `This action updates a #${id} chatHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatHistory`;
  }
}
