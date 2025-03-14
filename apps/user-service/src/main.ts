import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const configService = app.get(ConfigService);

  //  gRPC 서버 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: 'proto/user.proto', // gRPC 파일 경로
      url: '0.0.0.0:' + configService.get<string>('USER_GRPC_PORT'),
    },
  });

  await app.startAllMicroservices(); // gRPC 서비스 실행
  await app.listen(configService.get<string>('USER_SERVICE_PORT')!);
}
void bootstrap();
