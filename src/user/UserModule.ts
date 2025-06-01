import { Module } from '@nestjs/common';
import { FindUserByUsernameUseCase } from './application/FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { UserRepositoryImpl } from './infrastructure/repositoryImpl/UserRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from './infrastructure/entity/UserEntity';
import { FindUserByIdUseCase } from './application/FindUserByIdUseCase/FindUserByIdUseCase';
import { CreateLoginUseCase } from './application/CreateLoginUseCase/CreateLoginUseCase';
import { UserController } from './presentation/UserController';
import { CreateReissuedAccessTokenUseCase } from './application/CreateReissuedAccessTokenUseCase/CreateReissuedAccessTokenUseCase';
import { AuthModule } from 'src/auth/AuthModule';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntitiy]), AuthModule],
  controllers: [UserController],
  providers: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    CreateLoginUseCase,
    CreateReissuedAccessTokenUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    CreateLoginUseCase,
    CreateReissuedAccessTokenUseCase,
  ],
})
export class UserModule {}
