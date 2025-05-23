import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

initializeTransactionalContext();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';

  await AppDataSource.initialize();
  addTransactionalDataSource(AppDataSource); 

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
