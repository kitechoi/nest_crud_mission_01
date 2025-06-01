import * as dayjs from 'dayjs';
import { Logger } from '@nestjs/common';

type LoggingContext = 'request' | 'response';

interface HttpLogBody {
  context: LoggingContext;
  url: string;
  method: string;
  body: object;
  // headers: object;
}

export class HttpLogger {
  private readonly logger = new Logger('HttpLogger');
  constructor(private readonly context: LoggingContext) {}

  async log<T>(body: HttpLogBody & T, message: string = ''): Promise<void> {
    const logMessage = {
      context: this.context,
      url: body.url,
      method: body.method,
      datetime: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
      message,
      body: body.body,
      // headers: body.headers,
    };

    this.logger.log(JSON.stringify(logMessage));
  }
}
