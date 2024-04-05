interface IDataSource<T, C, R, U, D> {
  create(data: C): Promise<T>;
  read(data?: R): Promise<T | T[]>;
  update(data: U): Promise<T | undefined>;
  delete(data: D): Promise<boolean>;
}

export type { IDataSource }
