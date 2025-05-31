import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../infrastructure/UserRepository';
import { FindUserByIdUseCaseRequest } from './dto/FindUserByIdUseCaseRequest';
import { FindUserByIdUseCaseResponse } from './dto/FindUserByIdUseCaseResponse';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class FindUserByIdUseCase
  implements UseCase<FindUserByIdUseCaseRequest, FindUserByIdUseCaseResponse>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    request: FindUserByIdUseCaseRequest,
  ): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.userRepository.findById(request.id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      ok: true,
      user: user,
    };
  }
}
