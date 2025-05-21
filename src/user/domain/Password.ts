import { ValueObject } from 'src/shared/core/domain/ValueObject';
import { Result } from '../../shared/core/domain/Result';

interface PasswordProps {
  password: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static create(props: PasswordProps): Result<Password> {
    if (!/^[a-zA-Z0-9]{8,20}$/.test(props.password)) {
      return Result.fail('비밀번호는 8~20자의 영문자/숫자만 가능합니다.');
    }
    return Result.ok(new Password(props));
  }

  getValue(): string {
    return this.props.password;
  }
}
