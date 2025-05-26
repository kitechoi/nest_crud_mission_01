import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;


    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

        this.logger.error(
          `[${request.method}] ${httpAdapter.getRequestUrl(request)} | statusCode: ${httpStatus} | message: ${
            typeof message === 'string' ? message : JSON.stringify(message)
          } | path: ${httpAdapter.getRequestUrl(request)} | timestamp: ${new Date().toISOString()}`,
        );        

    response.status(httpStatus).json({
      statusCode: httpStatus,
      ok: false,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message,
    });
  }
}
