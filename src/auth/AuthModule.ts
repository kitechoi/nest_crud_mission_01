import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/JwtStrategy';
import { config } from 'src/shared/config/config';

@Module({
  imports: [
    forwardRef(() => UserModule), // 순환참조?
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: config.JWT_ACCESS_SECRET,
        signOptions: {
          expiresIn: config.JWT_ACCESS_EXPIRES_IN,
        },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
