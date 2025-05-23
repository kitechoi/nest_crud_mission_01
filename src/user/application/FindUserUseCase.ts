import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../infrastructure/UserRepository';
import { FindUserUseCaseResponse } from './dto/FindUserUseCaseResponse';
import { FindUserUseCaseRequest } from './dto/UserUseCaseRequest';
import { UseCase } from 'src/shared/core/application/UseCase';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserUseCase
  implements UseCase<FindUserUseCaseRequest, FindUserUseCaseResponse>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    request: FindUserUseCaseRequest,
  ): Promise<FindUserUseCaseResponse> {
    const user = await this.userRepository.findById(request.username);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      ok: true,
      user: user,
    };
  }
}