import { Module } from '@nestjs/common';
import { AuthController } from './presentation/AuthController';
import { UserModule } from '../user/UserModule';
import { AuthUseCase } from './application/AuthUseCase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './LocalStrategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthUseCase, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthUseCase],
})
export class AuthModule {}
