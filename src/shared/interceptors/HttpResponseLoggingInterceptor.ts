import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpLogger } from '../log/HttpLogger';

@Injectable()
export class HttpResponseLoggingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const logger = new HttpLogger('response');

    return next.handle().pipe(
      map((data) => {
        const responseBody = {
          statusCode: response.statusCode,
          ok: true,
          path: request.originalUrl,
          timestamp: new Date().toISOString(),
          result: data,
        };

        logger.log({
          context: 'response',
          url: request.url,
          method: request.method,
          body: responseBody,
          // headers: request.headers,
        });

        return responseBody;
      }),
    );
  }
}
