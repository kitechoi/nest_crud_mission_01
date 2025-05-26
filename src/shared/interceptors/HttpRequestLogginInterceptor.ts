import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpLogger } from '../log/HttpLogger';

@Injectable()
export class HttpRequestLoggingInterceptor implements NestInterceptor {

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();

    const logger = new HttpLogger('request');
    await logger.log({
      context: 'request',
      url: request.originalUrl,
      method: request.method,
      body: request.body,
      // headers: request.headers,
    });
    
    return next.handle();
  }
}
