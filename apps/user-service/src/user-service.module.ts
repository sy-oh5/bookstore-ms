import { Module } from '@nestjs/common';
import { UserGrpcController } from './controller/user-grpc.controller';
import { UserGrpcService } from './service/user-grpc.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        schema: configService.get<string>('POSTGRES_SCHEMA'),
        entities: [User],
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserGrpcController],
  providers: [UserGrpcService],
})
export class UserServiceModule {}
