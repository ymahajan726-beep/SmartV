import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Saari APIs ke aage '/api' prefix set kiya gaya hai
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true, // 👈 Isse kisi bhi Vercel/Live domain se request allow ho jayegi
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`Backend running on: http://localhost:${port}/api`);
}

bootstrap();