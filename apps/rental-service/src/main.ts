import { NestFactory } from '@nestjs/core';
import { RentalServiceModule } from './rental-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(RentalServiceModule);
  const configService = app.get(ConfigService);

  //  gRPC 서버 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'rental',
      protoPath: 'proto/rental.proto', // gRPC 파일 경로
      url: '0.0.0.0:' + configService.get<string>('RENTAL_GRPC_PORT'),
    },
  });

  await app.startAllMicroservices(); // gRPC 서비스 실행
  await app.listen(configService.get<string>('RENTAL_SERVICE_PORT')!);
}
void bootstrap();
