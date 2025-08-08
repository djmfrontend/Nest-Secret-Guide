import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: number;

  roles: Pick<Role, 'id' | 'name'>[];

  permissions: Permission[];
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
