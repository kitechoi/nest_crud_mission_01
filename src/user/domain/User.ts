import { Password } from 'src/user/domain/Password';
import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';

export interface UserProps {
  username: string;
  userPassword: Password;
  nickname: string;
  // isDeleted: boolean;
  // deletedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityID): Result<User> {

    if (
      !props.username ||
      props.username.length < 5 ||
      props.username.length > 20
    ) {
      return Result.fail('아이디는 6글자 이상, 20자 이하로 입력해야 합니다.');
    }

    return Result.ok(new User(props, id));
  }

  static createNew(props: UserProps): Result<User> {
    return this.create({ ...props });
  }

  get username(): string {
    return this.props.username;
  }

  get userPassword(): Password {
    return this.props.userPassword;
  }

  get nickname(): string {
    return this.props.nickname;
  }
}
