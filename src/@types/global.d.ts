import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      username: string;
      userIdFromDB: number;
    }
  }
}
