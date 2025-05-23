import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import * as cookieParser from 'cookie-parser';

initializeTransactionalContext();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';

  await AppDataSource.initialize();
  addTransactionalDataSource(AppDataSource);

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();

