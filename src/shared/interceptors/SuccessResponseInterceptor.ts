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
export class SuccessResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SuccessResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;

    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        ok: true,
        result: data,
      })),
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`[${method}] ${url} - ${delay}ms`);
      }),
    );
  }
}
