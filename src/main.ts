import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create app with CORS options at creation time
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS de forma explícita y robusta
  app.enableCors({
    origin: true, // Permite cualquier origen (para pruebas)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  // Apply global prefix AFTER CORS setup
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  console.log('✅ CORS configured at app creation');

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
}
void bootstrap();