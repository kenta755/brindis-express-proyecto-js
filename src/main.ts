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
  
  // CORS: Allow Vercel frontend and local development
  const allowedOrigins = [
    'http://localhost:5173',                    // Local dev
    'http://localhost:3000',                    // Local dev alt
    'https://brindis-express-proyecto-vue.vercel.app', // Main Vercel domain
    'https://brindis-express-proyecto-vue-fiee.vercel.app', // New deployment domain
    'https://brindis-express-proyecto-vue-fiee-nmipllr9r-kenta755s-projects.vercel.app', // Current deployment
    'https://brindis-express-proyecto-vue-fiee-him52yka-kenta755s-projects.vercel.app', // Latest deployment
  ];
  
  // Also allow any Vercel preview deployment (pattern matching)
  const isVercelDomain = (origin) => {
    return origin && (
      origin.includes('vercel.app') ||
      origin.includes('kenta755s-projects.vercel.app')
    );
  };
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      // Allow if in explicit list OR is a Vercel domain
      if (allowedOrigins.includes(origin) || isVercelDomain(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Cambia el listen para que use el puerto de Render o el 3000 por defecto
  await app.listen(process.env.PORT || 3000);
}
void bootstrap();