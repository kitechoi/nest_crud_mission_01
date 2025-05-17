export class Result<T> {
  public constructor(
    public isSuccess: boolean, 
    public error?: string, 
    private _value?: T,
  ) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }
    Object.freeze(this);
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error(this.error);
    }
    return this._value as T;
  }

  public errorValue(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }
}
