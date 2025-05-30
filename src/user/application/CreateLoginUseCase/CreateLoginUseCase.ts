import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindUserByUsernameUseCase } from '../FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { User } from 'src/user/domain/User';
import { CreateLoginUseCaseRequest } from './dto/CreateLoginUseCaseRequest';
import { CreateLoginUseCaseResponse } from './dto/CreateLoginUseCaseResponse';
import { Password } from 'src/user/domain/Password';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class CreateLoginUseCase
  implements UseCase<CreateLoginUseCaseRequest, CreateLoginUseCaseResponse>
{
  constructor(
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {}

  async execute(
    request: CreateLoginUseCaseRequest,
  ): Promise<CreateLoginUseCaseResponse> {
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
    request: CreateLoginUseCaseRequest,
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
