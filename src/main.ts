import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  // Agrega esta línea para que el frontend pueda conectarse
  app.enableCors();

  // Cambia el listen para que use el puerto de Render o el 3000 por defecto
  await app.listen(process.env.PORT || 3000);
}
void bootstrap();