import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    const { method, originalUrl, body, query, params } = request;

    this.logger.log(
      `[${method}] ${originalUrl} | query: ${JSON.stringify(query)} | params: ${JSON.stringify(params)} | body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const response = context.switchToHttp().getResponse();
        this.logger.log(
          `[${method}] ${originalUrl} ${response.statusCode} +${delay}ms`,
        );
      }),
    );
  }
}
