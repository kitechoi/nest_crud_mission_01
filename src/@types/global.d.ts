import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user: {
        userId: string;
        userIdFromDB: number;
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
  }
}
