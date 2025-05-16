export class Password {
  private constructor(private readonly value: string) { }

  static create(value: string): Password {
    if (!/^[a-zA-Z0-9]{4,10}$/.test(value)) {
      throw new Error('Invalid password');
    }
    return new Password(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }
}
