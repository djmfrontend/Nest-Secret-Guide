import { Inject, Injectable } from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDto } from './dto/history-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { generatePrivateRoomId } from 'src/utils';
import { HistoryPageDto } from './dto/history-page.dto';
@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  async list(chatRoomId: string, historyPage: HistoryPageDto) {
    const { page, size } = historyPage;

    const [historys, count] = await this.prismaService.$transaction([
      this.prismaService.chatHistory.findMany({
        skip: (page - 1) * size,
        take: size,
        where: {
          chatRoomId,
        },
      }),
      this.prismaService.chatHistory.count(),
    ]);
    return {
      list: historys,
      count,
    };
  }
  async add(chatRoomId: number, history: HistoryDto) {
    return await this.prismaService.chatHistory.create({
      data: history,
    });
  }
  create(createChatHistoryDto: CreateChatHistoryDto) {
    return 'This action adds a new chatHistory';
  }
  createMessage(createMessageDto: CreateMessageDto) {
    const { senderId, content, recipientId, type } = createMessageDto;
    const roomId = generatePrivateRoomId(senderId, recipientId);
    return this.prismaService.chatHistory.create({
      data: {
        content: content,
        type: type,
        senderId: senderId,
        recipientId: recipientId,
        chatRoomId: roomId,
        status: 'SENT',
      },
    });
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
