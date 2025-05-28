// src/auth/helpers/JwtWrapper.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/shared/config/config';

@Injectable()
export class JwtWrapper {
  constructor(private readonly jwtService: JwtService) {}

  signAccess(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: config.JWT_ACCESS_SECRET,
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
  }

  signRefresh(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: config.JWT_REFRESH_SECRET,
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: config.JWT_REFRESH_SECRET,
    });
  }
}
