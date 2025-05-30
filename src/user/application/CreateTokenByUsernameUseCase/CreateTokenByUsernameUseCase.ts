import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtWrapper } from 'src/auth/JwtWrapper';
import { FindUserByUsernameUseCase } from '../FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { User } from 'src/user/domain/User';

import { CreateTokenByUsernameUseCaseRequest } from './dto/CreateTokenByUsernameUseCaseRequest';
import { CreateTokenByUsernameUseCaseResonse } from './dto/CreateTokenByUsernameUseCaseResponse';
import { Password } from 'src/user/domain/Password';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class CreateTokenByUsernameUseCase
  implements
    UseCase<
      CreateTokenByUsernameUseCaseRequest,
      CreateTokenByUsernameUseCaseResonse
    >
{
  constructor(
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {}

  async execute(
    request: CreateTokenByUsernameUseCaseRequest,
  ): Promise<CreateTokenByUsernameUseCaseResonse> {
    const user = await this.validateUser(request);

    // 엑세스 토큰 발급
    const jwtAccessToken = user.issueJWTAccessToken();
    // 리프레시 토큰 발급
    const jwtRefreshToken = user.issueJWTRefreshToken();

    return {
      ok: true,
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
    };
  }

  // 비밀번호 유효성 검증, 유저 조회 및 pw 대조 검증 이 메서드에서 수행하고
  // User를 반환하는 방식이 괜찮은가.
  private async validateUser(
    request: CreateTokenByUsernameUseCaseRequest,
  ): Promise<User> {
    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const { user } = await this.findUserByUsernameUseCase.execute({
      username: request.username,
    });
    if (!user || !user.userPassword.equals(passwordResult.value)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
