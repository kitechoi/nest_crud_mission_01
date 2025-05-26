import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpRequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = request;

    this.logger.log(
      `[Req] ${method} ${originalUrl} | query: ${JSON.stringify(query)} | params: ${JSON.stringify(
        params,
      )} | body: ${JSON.stringify(body)}`,
    );

    return next.handle();
  }
}
