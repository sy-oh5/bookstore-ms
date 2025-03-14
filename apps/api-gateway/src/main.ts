import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //  Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Bookstore Microservices API Gateway')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); //  Swagger UI URL 설정

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('API_GATEWAY_PORT')!);
}
void bootstrap();
