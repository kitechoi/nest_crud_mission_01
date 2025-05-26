import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './shared/filters/AllExceptionsFilter';

initializeTransactionalContext();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpRequestLoggingInterceptor } from './shared/interceptors/HttpRequestLogginInterceptor';
import { HttpResponseLoggingInterceptor } from './shared/interceptors/HttpResponseLoggingInterceptor';

async function bootstrap() {
  process.env.TZ = 'Asia/Seoul';

  await AppDataSource.initialize();
  addTransactionalDataSource(AppDataSource);

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);
  
  app.useGlobalInterceptors(
    new HttpRequestLoggingInterceptor(),
    new HttpResponseLoggingInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();

