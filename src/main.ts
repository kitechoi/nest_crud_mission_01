import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
