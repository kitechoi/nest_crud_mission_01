import { forwardRef, Module } from '@nestjs/common';
import { FindUserByUsernameUseCase } from './application/FindUserByUsernameUseCase/FindUserByUsernameUseCase';
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { UserRepositoryImpl } from './infrastructure/repositoryImpl/UserRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from './infrastructure/entity/UserEntity';
import { FindUserByIdUseCase } from './application/FindUserByIdUseCase/FindUserByIdUseCase';
import { AuthModule } from 'src/auth/AuthModule';
import { CreateLoginUseCase } from './application/CreateLoginUseCase/CreateLoginUseCase';
import { UserController } from './presentation/UserController';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntitiy]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    FindUserByUsernameUseCase,
    FindUserByIdUseCase,
    CreateLoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [FindUserByUsernameUseCase, FindUserByIdUseCase, CreateLoginUseCase],
})
export class UserModule {}
