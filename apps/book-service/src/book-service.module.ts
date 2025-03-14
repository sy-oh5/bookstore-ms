import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookGrpcController } from './controller/book-grpc.controller';
import { BookGrpcService } from './service/book-grpc.service';

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
        entities: [Book],
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Book]),
  ],
  controllers: [BookGrpcController],
  providers: [BookGrpcService],
})
export class BookServiceModule {}
