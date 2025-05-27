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
      timestamp: new Date().toISOString(),
      path: httpUrl,
      ok: false,
      error: {
        message:
          exception instanceof Error ? exception.message : String(message),
      },
      result: {},
    };    
    if (exception instanceof HttpException) {
      responseBody.result = exception.getResponse();
    }

    logger
      .log({
        context: 'response',
        url: httpUrl,
        method: httpMethod,
        body: responseBody,
        headers: httpResponse.getHeaders(),
      })
      .then((r) => r);

    httpAdapter.reply(httpResponse, responseBody, httpStatus);
  }
}
