import { InternalServerErrorException } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { Password } from 'src/user/domain/Password';
import { User } from 'src/user/domain/User';
import { UserEntitiy } from '../entity/UserEntity';

export class UserRepositoryImplMapper {
  static toDomain(entity: UserEntitiy): User {
    const pwResult = Password.create({ password: entity.user_password });
    if (!pwResult.isSuccess) {
      throw new InternalServerErrorException(
        `Password 생성 실패: ${pwResult.error}`,
      );
    }

    const userResult = User.create(
      {
        username: entity.username,
        userPassword: pwResult.value,
        nickname: entity.nickname,
      },
      UniqueEntityID.create(entity.id),
    );

    if (!userResult.isSuccess) {
      throw new InternalServerErrorException(
        `User toDomain 실패: ${userResult.error}`,
      );
    }
    return userResult.value;
  }
}
