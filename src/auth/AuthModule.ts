import { Module } from '@nestjs/common';
import { AuthController } from './presentation/AuthController';
import { UserModule } from '../user/UserModule';
import { AuthUseCase } from './application/AuthUseCase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './LocalStrategy';
import { JwtStrategy } from './JwtStrategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthUseCase, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthUseCase],
})
export class AuthModule {}
