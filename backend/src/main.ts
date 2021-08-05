import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'
import * as passport from 'passport'
import { use } from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('Deluxe Pong')
    .setVersion('1.0')
    .addTag('Deluxe Pong')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      secret: 'secretforauthfourtytwo',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  await app.listen(3000);
}
bootstrap();