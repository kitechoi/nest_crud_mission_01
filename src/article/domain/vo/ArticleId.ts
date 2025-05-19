import { Result } from '../../../shared/core/domain/Result';

export class ArticleId {
  private constructor(private readonly value: number) {}

  static create(value: number): Result<ArticleId> {
    if (!Number.isInteger(value) || value <= 0) {
      return Result.fail('유효하지 않은 Id입니다.');
    }
    return Result.ok(new ArticleId(value));
  }

  getValue(): number {
    return this.value;
  }

  equals(other: ArticleId): boolean {
    return this.value === other.getValue();
  }
}
