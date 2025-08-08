import { Role } from 'src/user/entities/role.entity';
import { Permission } from 'src/user/entities/permission.entity';
interface JwtUserData {
  userId: number;
  username: string;
  roles: Pick<Role, 'id' | 'name'>[];
  permissions: Permission[];
}
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

export { JwtUserData };
