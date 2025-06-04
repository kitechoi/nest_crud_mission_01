import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/JwtStrategy';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
