import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindUserByUsernameUseCase } from 'src/user/application/FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { AuthUseCaseRequest } from './dto/AuthUseCaseRequest';
import { Password } from 'src/user/domain/Password';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/User';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { ConfigService } from '@nestjs/config';
import { Response as ExpressResponse } from 'express';
import { JwtWrapper } from '../JwtWrapper';
import { config } from '../../shared/config/config';
import { MissionJwtPayload } from 'src/auth/strategies/JwtStrategy';

@Injectable()
export class AuthUseCase {
  constructor(
    private findUserByUsernameUseCase: FindUserByUsernameUseCase,
    private jwtService: JwtService,
    private jwtWrapper: JwtWrapper,
    private configService: ConfigService,
  ) {}

  // localstrategy 에서 자동 호출
  async validateUser(request: AuthUseCaseRequest): Promise<User | null> {
    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const user = await this.findUserByUsernameUseCase.execute({
      username: request.username,
    });

    if (user && user.user.userPassword.equals(passwordResult.value)) {
      return user.user;
    }

    return null;
  }

  // controller 중 자동 호출
  async issueAccessToken(user: User): Promise<string> {
    const payload: MissionJwtPayload = {
      id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
      username: user.username,
      nickname: user.nickname,
    };

    return this.jwtWrapper.signAccess(payload);
  }

  async issueRefreshToken(user: User): Promise<string> {
    const payload = {
      id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
      username: user.username,
      nickname: user.nickname,
    };
    return this.jwtWrapper.signRefresh(payload);
  }

  setRefreshTokenCookie(res: ExpressResponse, token: string): void {
    const ms = require('ms');
    const JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;

    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ms(JWT_REFRESH_EXPIRES_IN),
    });
  }
}
