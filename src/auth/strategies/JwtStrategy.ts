// JwtStrategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../shared/config';

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;

export interface Mission02JwtPayload extends JwtPayload {
  id: number;
  username: string;
  nickname: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super();
  }

  async validate(request: Request): Promise<Mission02JwtPayload> {
    
    const token = (request.header('Bearer Token'));
    if (!token) {
      throw new UnauthorizedException('MissingToken');
      
    }
    try {
    jwt.verify(token, JWT_ACCESS_SECRET);
    const payload = jwt.decode(token) as Mission02JwtPayload;

    if (!payload.id || !payload.username || !payload.nickname) {
      throw new UnauthorizedException('InvalidPayload');
    }

    return {
      id: payload.id,
      username: payload.username,
      nickname: payload.nickname,
    };
    }
    catch (e) {
      throw e;
    }

  }
}
