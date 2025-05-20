import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserUseCase } from 'src/user/application/UserUseCase';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCaseRequest } from './dto/AuthUseCaseRequest';
import { Password } from 'src/article/domain/Password';

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: UserUseCase,
    private jwtService: JwtService,
  ) {}

  async signIn(request: AuthUseCaseRequest): Promise<{ access_token: string }> {

    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }
    
    const user = await this.userUseCase.execute({userId: request.userId});

    
    if (!(user.user.userPassword).equals(passwordResult.value)) {
      throw new UnauthorizedException("비번 틀림");
    }

    const payload = { sub: user.user.userId, name: user.user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
