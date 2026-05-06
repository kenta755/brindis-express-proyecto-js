import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create app with CORS enabled from the start
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true, // Allow all origins
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'Origin'],
    }
  });
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  console.log('✅ CORS enabled for all origins');

  // Cambia el listen para que use el puerto de Render o el 3000 por defecto
  await app.listen(process.env.PORT || 3000);
}
void bootstrap();