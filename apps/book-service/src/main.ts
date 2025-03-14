import { NestFactory } from '@nestjs/core';
import { BookServiceModule } from './book-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(BookServiceModule);
  const configService = app.get(ConfigService);
  //  gRPC 서버 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'book',
      protoPath: 'proto/book.proto', // gRPC 파일 경로
      url: '0.0.0.0:' + configService.get<string>('BOOK_GRPC_PORT'),
    },
  });

  await app.startAllMicroservices(); // gRPC 서비스 실행
  await app.listen(configService.get<string>('BOOK_SERVICE_PORT')!);
}
void bootstrap();
