import { UniqueEntityID } from './UniqueEntityID';

interface AggregateObjectProps {
  [index: string]: any;
}

export abstract class AggregateRoot<T extends AggregateObjectProps> {
  public readonly props: T;
  private readonly _id: UniqueEntityID;

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = { ...props };
    this._id = id ? id : new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
