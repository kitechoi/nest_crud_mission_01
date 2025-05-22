import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // req.user 에 들어갈 값
    console.log('payload:', payload);
    console.log('userIdFromDB:', Number(payload.id));
    return {
      userIdFromDB: Number(payload.id),
      userId: payload.sub,
      name: payload.name,
    };
  }
}
