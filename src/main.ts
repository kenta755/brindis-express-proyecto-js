import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS before any other middleware
  app.enableCors({
    origin: '*', // Allow ALL origins explicitly
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*', // Allow ALL headers
    exposedHeaders: '*',
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  console.log('✅ CORS enabled - origin: * (all origins allowed)');

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();