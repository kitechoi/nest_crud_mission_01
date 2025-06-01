import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './presentation/AuthController';
import { UserModule } from '../user/UserModule';
import { AuthUseCase } from './application/AuthUseCase';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/LocalStrategy';
import { JwtStrategy } from './strategies/JwtStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtWrapper } from './JwtWrapper';

@Module({
  imports: [
    forwardRef(() => UserModule), // 순환참조?
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthUseCase, LocalStrategy, JwtStrategy, JwtWrapper],
  controllers: [AuthController],
  exports: [AuthUseCase, JwtWrapper],
})
export class AuthModule {}
