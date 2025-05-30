import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/JwtStrategy';
import { config } from 'src/shared/config/config';

@Module({
  imports: [
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
