import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number | bigint> {
  constructor(id?: string | number | bigint) {
    super(id ? id : 0);
  }

  static create(id: string | number | bigint) {
    return new UniqueEntityID(id);
  }
}
