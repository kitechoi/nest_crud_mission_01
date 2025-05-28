// JwtStrategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { config } from '../../shared/config/config';

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;

export interface Mission02JwtPayload extends JwtPayload {
  userIdFromDB: number;
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

  async validate(request: Request, payload: Mission02JwtPayload): Promise<Mission02JwtPayload> {
    
    if (!payload.id || !payload.username || !payload.nickname) {
      throw new UnauthorizedException('InvalidPayload');
    }
    console.log("console.log(payload);",payload);

    return {
      userIdFromDB: payload.id,
      username: payload.username as string,
      nickname: payload.nickname,
    };
  }
}
