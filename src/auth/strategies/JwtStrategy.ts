// JwtStrategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { config } from '../../shared/config/config';

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;

export interface MissionJwtPayload extends JwtPayload {
  id: number;
  username: string;
  nickname: string;
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
    payload: MissionJwtPayload,
  ): Promise<MissionJwtPayload> {
    if (!payload.id || !payload.username || !payload.nickname) {
      throw new UnauthorizedException('InvalidPayload');
    }
    console.log('console.log(payload);', payload);

    return {
      id: payload.id,
      username: payload.username,
      nickname: payload.nickname,
    };
  }
}
