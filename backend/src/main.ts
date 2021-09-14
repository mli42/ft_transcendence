import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const fs = require('fs');
  const keySSL = fs.readFileSync(__dirname + '/../../etc/ssl/pong/server.key');
  const crtSSL = fs.readFileSync(__dirname + '/../../etc/ssl/pong/server.crt');

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keySSL,
      cert: crtSSL,
    },
  });

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('Deluxe Pong')
    .setVersion('1.0')
    .addTag('Deluxe Pong')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();