import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mysqlConfig = configService.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          database: string;
        }>('mysql');
        return {
          type: 'mysql',
          host: mysqlConfig?.host,
          username: mysqlConfig?.username,
          password: mysqlConfig?.password,
          database: mysqlConfig?.database,
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission],
          poolSize: 10,
          connectorPackage: 'mysql2',
        };
      },

      // extra: {
      //   authPlugin: 'sha256_password',
      // },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
