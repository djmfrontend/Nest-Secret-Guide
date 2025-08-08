import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UnauthorizedException,
  ParseIntPipe,
  BadRequestException,
  HttpException,
  HttpStatus,
  DefaultValuePipe,
} from '@nestjs/common';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { Inject } from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { JwtUserData } from 'src/types/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: String,
  })
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

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '用户刷新令牌',
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1NDY0NTcyMCwiZXhwIjoxNzU1MjUwNTIwfQ.hr6yMn_HmC4M7Wrh8gcUbfA88DouBU5tVYaLAD3ab-g',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokenVo,
    description: '刷新令牌成功',
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    const vo = new RefreshTokenVo();
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
        vo.accessToken = accessToken;
        vo.refreshToken = refreshToken;
        return vo;
      } else {
        vo.accessToken = '';
        vo.refreshToken = '';
        return vo;
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

  // 需要登录才能调用的接口也需要加上标注 认证的方式 需要在配置文件中配置
  @ApiBearerAuth()
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
  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }
  @Get('list')
  async list(
    @Query(
      'pageNo',
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException('pageNo is required');
        },
      }),
    )
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException('pageSize is required');
        },
      }),
    )
    pageSize: number,

    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    //
    return await this.userService.findUserByPage(
      pageNo,
      pageSize,
      username,
      nickName,
      email,
    );
  }
}
