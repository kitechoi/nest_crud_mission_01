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

  // Q. 이렇게 검증 메서드를 분리하는 것이 더 나은가?
  private async validateUser(
    request: CreateLoginUseCaseRequest,
  ): Promise<User> {
    const passwordResult = Password.create({ password: request.userPassword });
    // Q. 아래 if문 없으면 유효하지 않은 pw여도 SELECT 쿼리 날림. 있으나 없으나 로그 메시지는 동일하게 찍힘. if문이 필요할까?
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
