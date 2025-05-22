import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserUseCase } from 'src/user/application/FindUserUseCase';
import { AuthUseCaseRequest } from './dto/AuthUseCaseRequest';
import { Password } from 'src/user/domain/Password';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/User';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: UserUseCase,
    private jwtService: JwtService,
  ) {}

  // LocalStrategy에서 자체적으로 호출됨
  async validateUser(request: AuthUseCaseRequest): Promise<User | null> {
    const passwordResult = Password.create({ password: request.userPassword });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const user = await this.userUseCase.execute({ userId: request.userId });

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
      name: user.name, 
      sub: user.userId };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
