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

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: FindUserByUsernameUseCase,
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

    const user = await this.userUseCase.execute({ username: request.username });

    if (user && user.user.userPassword.equals(passwordResult.value)) {
      return user.user;
    }

    return null;
  }

  // controller 중 자동 호출
  async setAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
      username: user.username,
      nickname: user.nickname,
    };

    return {
      accessToken: this.jwtWrapper.signAccess( payload )
    };
  }

  async setRefreshToken(user: User, res: ExpressResponse) {
    const payload = {
      id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
      username: user.username,
      nickname: user.nickname,
    };

    const refreshToken = this.jwtWrapper.signRefresh( payload );
    // const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    // const refreshExpiresIn = this.configService.get<string>(
    //   'JWT_REFRESH_EXPIRES_IN',
    // );

    // if (!refreshSecret) {
    //   throw new InternalServerErrorException(
    //     'JWT_REFRESH_SECRET 환경변수가 설정되어 있지 않습니다.',
    //   );
    // }

    // if (!refreshExpiresIn) {
    //   throw new InternalServerErrorException(
    //     'JWT_REFRESH_EXPIRES_IN 환경변수가 설정되어 있지 않습니다.',
    //   );
    // }
    // const refreshToken = this.jwtService.sign(
    //   {
    //     id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
    //     sub: user.username,
    //   },
    //   {
    //     secret: refreshSecret,
    //     expiresIn: refreshExpiresIn,
    //   },
    // );

    const ms = require('ms');
    const JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ms(JWT_REFRESH_EXPIRES_IN),
    });
  }

  async reissueAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');
        
      if (!refreshSecret) {
        throw new InternalServerErrorException(
          'JWT_REFRESH_SECRET 환경변수가 설정되어 있지 않습니다.',
        );
      }

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
      console.log('dfdffdfdfdfdfdf',payload);
      const user = await this.userUseCase.execute({ username: payload.payload.username });

      return this.setAccessToken(user.user);
    } catch {
      throw new UnauthorizedException('리프레시 토큰 오류');
    }
  }
}
