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
      return Result.fail(
        'Password must be 8–20 characters long, containing only letters and numbers.',
      );
    }
    return Result.ok(new Password(props));
  }

  getValue(): string {
    return this.props.password;
  }
}
