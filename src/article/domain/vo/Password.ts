export class Password {
  constructor(private readonly value: string) {
  }
  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }

//   static getStringValue(value: Password): string {
//     return value.getValue();
//   }
}
