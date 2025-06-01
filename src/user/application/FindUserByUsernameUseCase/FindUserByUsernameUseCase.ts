import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../infrastructure/UserRepository';
import { FindUserByUsernameUseCaseResponse } from './dto/FindUserByUsernameUseCaseResponse';
import { FindUserByUsernameUseCaseRequest } from './dto/FindUserByUsernameUseCaseRequest';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class FindUserByUsernameUseCase
  implements
    UseCase<FindUserByUsernameUseCaseRequest, FindUserByUsernameUseCaseResponse>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    request: FindUserByUsernameUseCaseRequest,
  ): Promise<FindUserByUsernameUseCaseResponse> {
    const user = await this.userRepository.findByUsername(request.username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ok: true,
      user: user,
    };
  }
}
