import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepository } from "../infrastructure/UserRepository";

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: number,
  ): Promise<{ username: string; nickname: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      username: user.username,
      nickname: user.nickname,
    };
  }
}
