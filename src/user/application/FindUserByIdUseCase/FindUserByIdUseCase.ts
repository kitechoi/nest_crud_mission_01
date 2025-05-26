import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../infrastructure/UserRepository';
import { FindUserByIdUseCaseRequest } from './dto/\bFindUserByIdUseCaseRequest';
import { FindUserByIdUseCaseResponse } from './dto/FindUserByIdUseCaseResponse';

@Injectable()
export class FindUserByIdUseCase {
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
