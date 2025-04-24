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
import { Prisma } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';

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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (captcha !== user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
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
}
