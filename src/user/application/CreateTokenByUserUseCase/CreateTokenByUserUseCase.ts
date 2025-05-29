import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtWrapper } from 'src/auth/JwtWrapper';
import { FindUserByUsernameUseCase } from '../FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { User } from 'src/user/domain/User';

import { CreateTokenByUserUseCaseRequest } from './dto/CreateTokenByUserUseCaseRequest';
import { CreateTokenByUserUseCaseResonse } from './dto/CreateTokenByUserUseCaseResponse';
import { Password } from 'src/user/domain/Password';

@Injectable()
export class CreateTokenByUserUseCase {
  constructor(
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {}

  async execute(
    request: CreateTokenByUserUseCaseRequest,
  ): Promise<CreateTokenByUserUseCaseResonse> {

    // 유저 유효성 검증 -> validateUser 메서드를 어디에 따로 만들면 좋을까.
    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const userResponse = await this.findUserByUsernameUseCase.execute({
      username: request.username,
    });

    if (
      !(
        userResponse &&
        userResponse.user.userPassword.equals(passwordResult.value)
      )
    ) {
      throw new UnauthorizedException();
    }

    // 엑세스 토큰 발급
    const user = userResponse.user;
    const jwtAccessToken = user.issueJWTAccessToken();
    const jwtRefreshToken = user.issueJWTRefreshToken();

    return {
      ok: true,
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
    };
  }
}
