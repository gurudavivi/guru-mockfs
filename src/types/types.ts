export type NestedNodes = {
  [key: string]: string | null | { [key: string]: string | NestedNodes };
};

export type Nodes = { [key: string]: string | null };

export type ClassConstructor<T> = new (...args: any[]) => T;
