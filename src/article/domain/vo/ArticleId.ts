export class ArticleId {
  constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('유효하지 않은 ID입니다.');
    }
  }

  getValue(): number {
    return this.value;
  }

  equals(other: ArticleId): boolean {
    return this.value === other.getValue();
  }
}
