import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/AllExceptionsFilter';
import { HttpRequestLoggingInterceptor } from './shared/interceptors/HttpRequestLogginInterceptor';
import { HttpResponseLoggingInterceptor } from './shared/interceptors/HttpResponseLoggingInterceptor';

const bootstrap = async () => {
  initializeTransactionalContext();
  process.env.TZ = 'Asia/Seoul';

  // patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });

  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalInterceptors(
    new HttpResponseLoggingInterceptor(),
    new HttpRequestLoggingInterceptor(),
  );

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  await app.listen(process.env.PORT ?? 80);
};
bootstrap();
