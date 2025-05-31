import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { HttpLogger } from '../log/HttpLogger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse<Response>();
    const httpRequest = ctx.getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;
    const logger = new HttpLogger('response');

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const httpUrl = httpAdapter.getRequestUrl(httpRequest);
    const httpMethod = httpRequest.method;

    const responseBody = {
      statusCode: httpStatus,
      ok: false,
      path: httpUrl,
      timestamp: new Date().toISOString(),
      error: {
        message:
          exception instanceof Error ? exception.message : String(message),
      },
    };

    logger
      .log({
        context: 'response',
        url: httpUrl,
        method: httpMethod,
        body: responseBody,
        // headers: httpResponse.getHeaders(),
      })
      .then((r) => r);

    httpAdapter.reply(httpResponse, responseBody, httpStatus);
  }
}
