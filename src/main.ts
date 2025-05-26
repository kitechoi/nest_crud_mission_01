import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './shared/filters/AllExceptionsFilter';
import { SuccessResponseInterceptor } from './shared/interceptors/SuccessResponseInterceptor';

initializeTransactionalContext();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './shared/interceptors/HttpLoggingInterceptor';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';

  await AppDataSource.initialize();
  addTransactionalDataSource(AppDataSource);

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);
  
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new SuccessResponseInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();

