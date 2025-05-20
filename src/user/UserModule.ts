import { Module } from '@nestjs/common';
import { UserUseCase } from './application/UserUseCase';

@Module({
  providers: [UserUseCase],
  exports: [UserUseCase],
})

export class UserModule {}
