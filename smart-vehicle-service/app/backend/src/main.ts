import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Yeh line zaroori hai taaki saari APIs ke aage '/api' lag jaye
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Port zaroor 3001 hona chahiye jahan frontend call kar raha hai
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`Backend running on: http://localhost:${port}/api`);
}
await bootstrap();