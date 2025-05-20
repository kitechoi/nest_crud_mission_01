import { Module } from '@nestjs/common';
import { AuthController } from './presentation/AuthController';
import { UserModule } from '../user/UserModule';
import { AuthUseCase } from './application/AuthUseCase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './AuthGuard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthUseCase],
  controllers: [AuthController],
  exports: [AuthUseCase],
})
export class AuthModule {}
