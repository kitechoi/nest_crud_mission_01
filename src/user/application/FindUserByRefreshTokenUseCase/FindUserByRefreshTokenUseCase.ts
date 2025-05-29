import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtWrapper } from "src/auth/JwtWrapper";
import { FindUserByUsernameUseCase } from "../FindUserByUsernameUseCase/FindUserByUsernameUseCase";
import { User } from "src/user/domain/User";
import { FindUserByRefreshTokenUseCaseRequest } from './dto/FindUserByRefreshTokenUseCaseRequest';
import { FindUserByRefreshTokenUseCaseResponse } from './dto/FindUserByRefreshTokenUseCaseResponse';

@Injectable()
export class FindUserByRefreshTokenUseCase {
  constructor(
    private readonly jwtWrapper: JwtWrapper,
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {}

  async execute(
    request: FindUserByRefreshTokenUseCaseRequest,
  ): Promise<FindUserByRefreshTokenUseCaseResponse> {
    const decodedJWt = this.jwtWrapper.verifyRefreshToken(request.refreshToken);
    const userResponse = await this.findUserByUsernameUseCase.execute({
      username: decodedJWt.username,
    });

    if (!userResponse || !userResponse.user) {
      throw new UnauthorizedException('해당 유저를 찾을 수 없습니다.');
    }

    return {
      ok: true,
      user: userResponse.user,
    };
  }
}
