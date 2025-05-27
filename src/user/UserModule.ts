import { Module } from '@nestjs/common';
import { FindUserByUsernameUseCase } from './application/FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { UserRepositoryImplMapper } from './infrastructure/mapper/UserRepositoryImplMapper';
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { UserRepositoryImpl } from './infrastructure/repositoryImpl/UserRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from './infrastructure/entity/UserEntity';
import { FindUserByIdUseCase } from './application/FindUserByIdUseCase/FindUserByIdUseCase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntitiy])],
  providers: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    UserRepositoryImplMapper,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [FindUserByUsernameUseCase, FindUserByIdUseCase],
})
export class UserModule {}
