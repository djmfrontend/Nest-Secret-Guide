import { IsNotEmpty, isNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDto {
  headPic: string;

  @IsNotEmpty({
    message: '用户昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '用户邮箱不能为空',
  })
  email: string;
}
