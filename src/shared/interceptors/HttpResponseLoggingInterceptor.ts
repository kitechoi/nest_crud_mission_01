import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class HttpResponseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpResponseLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();


    const { method, originalUrl } = request;

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        ok: true,
        path: originalUrl,
        timestamp: new Date().toISOString(),
        result: data,
      })),
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(
          `[Res] ${response.statusCode} | ${method} ${originalUrl} +${delay}ms`,
        );
      }),
    );
  }
}
