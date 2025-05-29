import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/shared/config/config';
import { MissionJwtPayload } from 'src/auth/strategies/JwtStrategy';

type DecodedJwt = MissionJwtPayload & { iat: number; exp: number };

@Injectable()
export class JwtWrapper {
  constructor(private readonly jwtService: JwtService) {}

  signAccess(payload: MissionJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: config.JWT_ACCESS_SECRET,
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
  }

  signRefresh(payload: MissionJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: config.JWT_REFRESH_SECRET,
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
  }

  verifyRefreshToken(token: string): DecodedJwt {
    return this.jwtService.verify<DecodedJwt>(token, {
      secret: config.JWT_REFRESH_SECRET,
    });
  }
}