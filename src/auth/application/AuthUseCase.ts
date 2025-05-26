import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindUserByUsernameUseCase } from 'src/user/application/FindUserByUsernameUseCase';
import { AuthUseCaseRequest } from './dto/AuthUseCaseRequest';
import { Password } from 'src/user/domain/Password';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/User';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { jwtConstants } from '../constants';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: FindUserByUsernameUseCase,
    private jwtService: JwtService,
  ) {}

  // LocalStrategy에서 자체적으로 호출됨
  async validateUser(request: AuthUseCaseRequest): Promise<User | null> {
    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const user = await this.userUseCase.execute({ username: request.username });

    if (user && user.user.userPassword.equals(passwordResult.value)) {
      const { userPassword, ...result } = user.user;
      return user.user;
    }
    return null;
  }

  // Controller signin 과정 중 호출됨
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
    const refreshToken = this.jwtService.sign(
      {
        id: user.id instanceof UniqueEntityID ? user.id.toNumber() : user.id,
        sub: user.username,
      },
      {
        secret: jwtConstants.refreshSecret, // access와 분리된 refresh secret
        expiresIn: '14d',
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
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      const user = await this.userUseCase.execute({ username: payload.sub });

      return this.generateAccessToken(user.user);
    } catch {
      throw new UnauthorizedException('리프레시 토큰 오류');
    }
  }
}
