import { Password } from "src/article/domain/Password";
import { AggregateRoot } from "src/shared/core/domain/AggregateRoot";
import { Result } from "src/shared/core/domain/Result";
import { UniqueEntityID } from "src/shared/core/domain/UniqueEntityID";

export interface UserProps {
  userId: string;
  userPassword: Password;
  name: string;
  // isDeleted: boolean;
  // deletedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    // 검증로직 제약

    
    return Result.ok(new User(props, id));
  }

  static createNew(props: UserProps): Result<User> {
    return this.create({ ...props });
  }

  get userId(): string {
    return this.props.userId;
  }

  get userPassword(): Password {
    return this.props.userPassword;
  }

  get name(): string {
    return this.props.name;
  }
 }

