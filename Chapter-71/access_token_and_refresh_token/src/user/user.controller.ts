import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginGuard } from 'src/login.guard';
import { UnauthorizedException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    // 返回access TOken 和 refresh TOken
    const user = await this.userService.login(
      loginDto.username,
      loginDto.password,
    );
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        expiresIn: '30m',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('aaa')
  aaa() {
    return 'aaa';
  }
  @Get('bbb')
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb';
  }
  // 刷新 access_token

  // 前端获取到refresh_token后，发送请求  该请求会去延长accessToken
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      console.log(user);
      // 获取到user 后  延长accessToken
      if (user) {
        const accessToken = this.jwtService.sign(
          {
            userId: user.id,
            username: user.username,
          },
          {
            expiresIn: '30m',
          },
        );
        const refereshToken = this.jwtService.sign(
          {
            userId: user.id,
          },
          {
            expiresIn: '7d',
          },
        );
        return {
          accessToken,
          refereshToken,
        };
      } else {
        throw new UnauthorizedException('用户未登录');
      }
    } catch (e) {
      throw new UnauthorizedException('用户未登录');
      //
    }
  }
}
