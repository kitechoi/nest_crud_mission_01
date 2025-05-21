import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUseCase } from './application/AuthUseCase';
import { User } from 'src/user/domain/User';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authUseCase: AuthUseCase) {
    super({
      usernameField: 'userId',
      passwordField: 'userPassword',
    });
  }

  async validate(userId: string, userPassword: string): Promise<User> {
    const user = await this.authUseCase.validateUser({ userId, userPassword });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
