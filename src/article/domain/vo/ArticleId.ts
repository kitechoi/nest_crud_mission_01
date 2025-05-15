export class ArticleId {
  private constructor(private readonly value: number) {
  }

  static from(value: number): ArticleId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('유효하지 않은 ID입니다.');
    }
    return new ArticleId(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: ArticleId): boolean {
    return this.value === other.getValue();
  }
}
