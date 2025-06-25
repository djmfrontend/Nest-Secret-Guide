import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ChatHistory } from '@prisma/client';
import { generatePrivateRoomId } from 'src/utils';

interface JoinRoomPayload {
  friendId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  recipientId: number;
  message: {
    type: ChatHistory['type'];
    content: string;
  };
}
interface HistoryMessagePayload {
  history: ChatHistory[];
  count: number;
}
@WebSocketGateway({
  cros: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 需要实现接口
  // 记录每个房间的在线用户数 roomId -> Set<userId>
  private readonly onlineUser = new Map<string, Set<number>>();

  handleConnection(client: any, ...args: any[]) {
    // 连接成功  client 谁连接进来了
    console.log('client', client.id);
  }
  handleDisconnect(client: Socket) {
    // 断开连接
    console.log('client', client);
  }

  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server;
  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ): Promise<WsResponse<HistoryMessagePayload>> {
    console.log(this.onlineUser);
    const { userId, friendId } = payload;
    const roomId = generatePrivateRoomId(userId, friendId);
    console.log(roomId, '================');
    client.data.userId = userId;
    client.join(roomId);
    // 初始化房间在线用户列表
    if (!this.onlineUser.has(roomId)) {
      this.onlineUser.set(roomId, new Set());
    }
    const roomUsers = this.onlineUser.get(roomId);
    const wasOnline = roomUsers?.has(userId);
    roomUsers?.add(userId);
    // 获取房间内其他用户
    const otherOnlineUsers = Array.from(roomUsers || []).filter(
      (id) => id !== userId,
    );
    if (!wasOnline) {
      // 1. 通知房间内其他用户当前用户已上线
      client.to(roomId).emit('userOnline', { userId });
      // 2. 向当前用户发送房间内其他用户的在线状态
      if (otherOnlineUsers.length > 0) {
        client.emit('usersOnline', {
          users: otherOnlineUsers.map((id) => ({ userId: id, status: true })),
        });
      }
      //
      // this.server.to(roomId).emit('userStatus', {
      //   userId,
      //   status: true,
      // });
    }
    // 获取历史消息 需要通过callback返回
    const { count, list } = await this.chatHistoryService.list(roomId, {
      page: 1,
      size: 10,
    });

    return {
      event: 'initialHistory',
      data: {
        history: list,
        count: count,
      },
    };
    // this.server.to(roomName).emit('message', {
    //   type: 'joinRoom',
    //   userId: payload.userId,
    // });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(this.onlineUser);
    const { message, sendUserId, recipientId } = payload;
    if (client.data.userId !== sendUserId) {
      console.log('用户信息错误');
      throw new WsException('用户信息错误');
    }
    const roomId = generatePrivateRoomId(sendUserId, recipientId);
    console.log(roomId);
    const newMessage = await this.chatHistoryService.createMessage({
      senderId: sendUserId,
      recipientId: recipientId,
      content: message.content,
      type: message.type,
    });
    this.server.to(roomId).emit('message', newMessage);
    //// 检查接收者是否在线（在房间中），更新状态为已送达
    // const isRecipientOnline = this.
    //创建消息实体并保存到数据库
    // await this.chatHistoryService.add(payload.chatroomId, {
    //   content: payload.message.content,
    //   type: payload.message.type,
    //   senderId: payload.sendUserId,
    //   chatRoomId: payload.chatroomId,
    // });
    // 构造发送给客户端的消息格式
    return {
      event: 'messageSent',
      data: newMessage,
    };
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
