import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { config } from 'src/shared/config/config';

export interface JwtRefreshPayload {
  id: number;
  username: string;
  nickname: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Missing RefreshToken');
    }

    try {
      const payload: JwtRefreshPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: config.JWT_REFRESH_SECRET,
        },
      );

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid RefreshToken');
    }
  }
}
