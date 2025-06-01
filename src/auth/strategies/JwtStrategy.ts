import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from '../../shared/config/config';

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;

export interface JwtAccessPayload {
  id: number;
  username: string;
  nickname: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: JwtAccessPayload,
  ): Promise<JwtAccessPayload> {
    const { id, username, nickname } = payload;

    if (!id || !username || !nickname) {
      throw new UnauthorizedException('Invalid payload');
    }
    return payload;
  }
}
