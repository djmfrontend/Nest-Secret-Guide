import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;
  @IsNotEmpty({
    message: ' 密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能小于6位',
  })
  @MaxLength(10, {
    message: '密码不能大于10位',
  })
  password: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
