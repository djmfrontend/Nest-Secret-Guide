import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendAddDto {
  @IsNotEmpty({
    message: '添加的好友ID不能为空',
  })
  friendId: number;

  reason: string;
}
