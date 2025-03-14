import { Module } from '@nestjs/common';
import { RentalGrpcController } from './controller/rental-grpc.controller';
import { RentalGrpcService } from './service/rental-grpc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entity/rental.entity';
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
        entities: [Rental],
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Rental]),
  ],
  controllers: [RentalGrpcController],
  providers: [RentalGrpcService],
})
export class RentalServiceModule {}
