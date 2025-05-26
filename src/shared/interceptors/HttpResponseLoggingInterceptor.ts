import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpLogger } from '../log/HttpLogger';

@Injectable()
export class HttpResponseLoggingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const logger = new HttpLogger('response');

    return next.handle().pipe(
      map((data) => {
        if (request.path === '/') {
          return data;
        }

        return {
          ...data,
        };
      }),
      tap(async (data) => {
        await logger.log({
          context: 'response',
          url: request.url,
          method: request.method,
          body: data as object,
          // headers: response.getHeaders(),
        });
      }),
    );
  }
}
