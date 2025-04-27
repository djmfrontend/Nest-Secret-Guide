import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin } from 'src/custom.decorator';
import { UserInfo } from 'src/custom.decorator';
import { JwtUserData } from 'src/auth.guard';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
  @Get('register-captcha')
  async captha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const user = await this.userService.login(body);
    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }
  @Get('aaa')
  @RequireLogin()
  aaa(@UserInfo() user) {
    console.log(user);
    return 'aaa';
  }
  @Get('info')
  @RequireLogin()
  async info(@UserInfo() user: JwtUserData) {
    console.log(user.userId);
    const findUser = await this.userService.fineOne(user.userId);
    return findUser;
  }

  @Post('update_password')
  @RequireLogin()
  async updatePasswrd(
    @Body() body: UpdateUserPasswordDto,
    @UserInfo() user: JwtUserData,
  ) {
    return this.userService.updatePassword(user.userId, body);
  }
}
