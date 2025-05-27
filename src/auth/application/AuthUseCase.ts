import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: FindUserByUsernameUseCase,
    private jwtService: JwtService,
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
  async generateAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
      nickname: user.nickname,
      sub: user.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  setRefreshToken(user: User, res: ExpressResponse) {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '14d';

    const refreshToken = this.jwtService.sign(
      {
        id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
        sub: user.username,
      },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      },
    );

    res.setHeader('Set-Cookie', [
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=1209600`,
    ]);
  }

  async reissueAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.userUseCase.execute({ username: payload.sub });

      return this.generateAccessToken(user.user);
    } catch {
      throw new UnauthorizedException('리프레시 토큰 오류');
    }
  }
}
