
export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};
