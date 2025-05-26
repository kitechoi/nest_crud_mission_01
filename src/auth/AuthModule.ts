import { Module } from '@nestjs/common';
import { AuthController } from './presentation/AuthController';
import { UserModule } from '../user/UserModule';
import { AuthUseCase } from './application/AuthUseCase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './LocalStrategy';
import { JwtStrategy } from './JwtStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60s',
        },
      }),
    }),
  ],
  providers: [AuthUseCase, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthUseCase],
})
export class AuthModule {}
