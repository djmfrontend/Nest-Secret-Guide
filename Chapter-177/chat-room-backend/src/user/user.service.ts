import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
type SelectUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    nickName: true;
    email: true;
    headPic: true;
  };
}>;
@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaServce: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();
  async create(data: Prisma.UserCreateInput) {
    const user = await this.prismaServce.user.create({
      data,
      select: {
        id: true,
      },
    });

    return user;
  }
  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.prismaServce.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (foundUser.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    delete (foundUser as { password?: string }).password;
    return foundUser;
  }
  async fineOne(id: number) {
    const user = await this.prismaServce.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        email: true,
        headPic: true,
        createdTime: true,
      },
    });
    if (user) {
      return user;
    }
    return null;
  }

  findAll() {
    return `This action returns all user`;
  }
  async updatePassword(id: number, passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prismaServce.user.findUnique({
      where: {
        id: id,
      },
    });
    if (foundUser) {
      foundUser.password = passwordDto.password;
      try {
        await this.prismaServce.user.update({
          where: {
            id: foundUser.id,
          },
          data: foundUser,
        });
        return '密码修改成功';
      } catch (e) {
        this.logger.error(e, UserService);
        return '密码修改失败';
      }
    } else {
      return '用户不存在';
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async register(user: RegisterUserDto) {
    // const captcha = await this.redisService.get(`captcha_${user.email}`);
    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }
    // if (captcha !== user.captcha) {
    //   throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    // }
    const foundUser = await this.prismaServce.user.findUnique({
      where: {
        username: user.username,
      },
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.prismaServce.user.create({
        data: {
          username: user.username,
          password: user.password,
          nickName: user.nickName,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          headPic: true,
          createdTime: true,
        },
      });
    } catch (e) {
      console.log(e);
      this.logger.error(e, UserService);
      return null;
    }
  }

  async getFriendship(userId: number) {
    // const friends = await this.prismaServce
    // this.prismaServce
    /**
     * SELECT * 
          FROM friendship
          WHERE userId = ? OR friendId = ?;
     */
    const friends = await this.prismaServce.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
    });
    const set = new Set<number>();
    for (let i = 0; i < friends.length; i++) {
      set.add(friends[i].userId as number);
      set.add(friends[i].friendId as number);
    }
    const friendsList = [...set].filter((item) => item !== userId);
    const res: SelectUser[] = [];
    for (let i = 0; i < friendsList.length; i++) {
      const user = await this.prismaServce.user.findUnique({
        where: {
          id: friendsList[i],
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          headPic: true,
          email: true,
        },
      });
      if (user) {
        res.push(user);
      }
    }
    return res;
  }
}
