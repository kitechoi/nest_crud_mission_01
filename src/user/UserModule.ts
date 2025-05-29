import { forwardRef, Module } from '@nestjs/common';
import { FindUserByUsernameUseCase } from './application/FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { UserRepositoryImpl } from './infrastructure/repositoryImpl/UserRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from './infrastructure/entity/UserEntity';
import { FindUserByIdUseCase } from './application/FindUserByIdUseCase/FindUserByIdUseCase';
import { FindUserByRefreshTokenUseCase } from './application/FindUserByRefreshTokenUseCase/FindUserByRefreshTokenUseCase';
import { AuthModule } from 'src/auth/AuthModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntitiy]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    FindUserByRefreshTokenUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    FindUserByRefreshTokenUseCase,
  ],
})
export class UserModule {}
