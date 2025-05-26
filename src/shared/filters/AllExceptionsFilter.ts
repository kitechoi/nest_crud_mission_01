// src/shared/filters/AllExceptionsFilter.ts
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

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const url = httpAdapter.getRequestUrl(request);
    const method = request.method;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      ok: false,
      error: {
        message:
          exception instanceof Error ? exception.message : String(message),
      },
      result: {},
    };

    this.logger.error({
      method,
      url,
      statusCode: status,
      message: responseBody.error.message,
      timestamp: responseBody.timestamp,
    });

    httpAdapter.reply(response, responseBody, status);
  }
}
