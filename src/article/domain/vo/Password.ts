import { Result } from '../../../shared/core/Result';

export class Password {
  private constructor(private readonly value: string) {
  }

  static create(value: string): Result<Password> {
    if (!/^[a-zA-Z0-9]{4,10}$/.test(value)) {
      return Result.fail('비밀번호는 4~10자의 영문자/숫자만 가능합니다.');
    }
    return Result.ok(new Password(value));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }
}
