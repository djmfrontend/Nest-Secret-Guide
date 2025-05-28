import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ChatHistory } from '@prisma/client';
interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}


@WebSocketGateway({
  cros: {
    origin: '*',
  },
})
interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: ChatHistory['type'],
    content: string
  }
}
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server;
  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @SubscribeMessage('joinRoom')
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const roomName = payload.chatroomId.toString();

    client.join(roomName);
    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    });
  }

  @SubscribeMessage('sendMessage')
 async sendMessage(@MessageBody() payload:SendMessagePayload,@ConnectedSocket() client: Socket){
    const roomName = payload.chatroomId.toString();
    await this.chatHistoryService.add(payload.chatroomId,{
      content:payload.message.content,
      type:payload.message.type,
      senderId:payload.sendUserId,
      chatRoomId:payload.chatroomId
    })
    this.server.to(roomName).emit('message',{
      type: 'sendMessage',
      userId: payload.sendUserId,
      message: payload.message
    })
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
