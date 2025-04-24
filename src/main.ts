import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Permitir todas las conexiones en desarrollo
  app.enableCors({
    origin: '*', // Permite cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
