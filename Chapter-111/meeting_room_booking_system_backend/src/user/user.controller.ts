import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { Inject } from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { JwtUserData } from 'src/types/jwt';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser);

    return this.userService.register(registerUser);
  }
  @Get('init')
  init() {
    return this.userService.initData();
  }
  @Post('login')
  async userLogin(@Body() loginDto: LoginUserDto) {
    console.log(loginDto);
    const vo = await this.userService.login(loginDto, false);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      { expiresIn: this.configService.get('jwt.expiresIn') || '30m' },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('jwt.refreshExpiresIn') || '7d',
      },
    );
    return vo;
  }
  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginUserDto) {
    const vo = await this.userService.login(loginDto, true);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      { expiresIn: this.configService.get('jwt.expiresIn') || '30m' },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('jwt.refreshExpiresIn') || '7d',
      },
    );
    return vo;
  }
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify<{
        userId: number;
      }>(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);
      if (user) {
        const accessToken = this.jwtService.sign(
          {
            userId: user.id,
            username: user.username,
            roles: user.roles,
            permissions: user.permissions,
          },
          { expiresIn: this.configService.get('jwt.expiresIn') || '30m' },
        );
        const refreshToken = this.jwtService.sign(
          {
            userId: user.id,
          },
          { expiresIn: this.configService.get('jwt.refreshExpiresIn') || '7d' },
        );
        return {
          accessToken,
          refreshToken,
        };
      } else {
        return {
          accessToken: '',
          refreshToken: '',
        };
      }
    } catch (e) {
      //
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify<{
        userId: number;
      }>(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      if (user) {
        const accessToken = this.jwtService.sign(
          {
            userId: user.id,
            username: user.username,
            roles: user.roles,
            permissions: user.permissions,
          },
          { expiresIn: this.configService.get('jwt.expiresIn') || '30m' },
        );
        const refreshToken = this.jwtService.sign(
          {
            userId: user.id,
          },
          { expiresIn: this.configService.get('jwt.refreshExpiresIn') || '7d' },
        );
        return {
          accessToken,
          refreshToken,
        };
      } else {
        return {
          accessToken: '',
          refreshToken: '',
        };
      }
    } catch (e) {
      //
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    if (user) {
      vo.id = user.id;
      vo.email = user.email;
      vo.headPic = user.headPic;
      vo.isFrozen = user.isFrozen;
      vo.nickName = user.nickName;
      vo.phoneNumber = user.phoneNumber;
      vo.username = user.username;
      vo.createTime = user.createTime;
    } else {
      return null;
    }

    // return await this.userService.findUserById(userId);
  }

  @Post('update_password')
  @RequireLogin()
  async updatePaasword(
    @UserInfo() user: JwtUserData,
    @Body()
    body: {
      password: string;
    },
  ) {
    console.log(user.userId);
    await this.userService.updatePassword(user.userId, body.password);

    return 'success';
  }
}
