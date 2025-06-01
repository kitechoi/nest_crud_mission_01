import * as jwt from 'jsonwebtoken';
import { config } from 'src/shared/config/config';
import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { Password } from 'src/user/domain/Password';

const JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRES_IN = config.JWT_ACCESS_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;

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
      props.username.length < 6 ||
      props.username.length > 20
    ) {
      return Result.fail('Username must be between 6 and 20 characters.');
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

  issueJWTAccessToken(): string {
    return jwt.sign(
      {
        id: this.id.toNumber(),
        username: this.props.username,
        nickname: this.props.nickname,
      },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );
  }

  issueJWTRefreshToken(): string {
    return jwt.sign(
      {
        id: this.id.toNumber(),
        username: this.props.username,
        nickname: this.props.nickname,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN },
    );
  }
}
