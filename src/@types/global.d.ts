import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      userId: string;
      userIdFromDB: number;
    }
  }
}
