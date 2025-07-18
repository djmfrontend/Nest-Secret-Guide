import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async login(username: string, password: string) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username,
        password,
      },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }
    if (user.password !== password) {
      throw new HttpException('密码错误', HttpStatus.OK);
    }
    return user;
  }

  async findUserById(id: number) {
    const user = await this.entityManager.findOne(User, {
      where: {
        id,
      },
    });
    return user;
  }
}
