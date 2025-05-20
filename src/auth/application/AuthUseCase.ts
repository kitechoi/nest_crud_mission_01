import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserUseCase } from 'src/user/application/UserUseCase';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCaseRequest } from './AuthUseCaseRequest';

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: UserUseCase,
    private jwtService: JwtService,
  ) {}

  async signIn(request: AuthUseCaseRequest): Promise<{ access_token: string }> {
    const user = await this.userUseCase.findOne(request.userId);
    if (user?.userPassword !== request.userPassword) {
      throw new UnauthorizedException("비번 틀림");
    }

    const payload = { sub: user.userId, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
