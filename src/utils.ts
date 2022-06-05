import f from 'lodash/fp';

import { ClassConstructor, Nodes } from './types/types';

export const regexNode = /['']?[\w.]+/g;
export const regexTree = (value: string) => `['']?${value}.*`;
export const regexChilds = (value: string) => `['']?${value}/[^/]+$`;

export function getMethods<T>(
  constructor: ClassConstructor<T>,
): (string | symbol)[] {
  return Reflect.ownKeys(Object.getPrototypeOf(new constructor()));
}

export function normalizePath(path: string): string {
  return path
    .replace(/\/\//g, '/')
    .replace(/\/\.\//g, '/')
    .replace(/\/\//g, '/')
    .replace(/\/\.$/, '')
    .replace(/\/\.\//, '/')
    .replace(/\/\.\.$/, '')
    .replace(/\/\.\.\//, '/')
    .replace(/[./]{2,}/g, '/');
}

export function getFileSize(content: string): number {
  return Buffer.byteLength(content, 'utf8');
}

export function sortNodes(node: Nodes): Nodes {
  return f.pipe(
    f.toPairs,
    f.sortBy(f.pipe(f.get(0), f.split('/'), f.slice(0)(-1))),
    f.fromPairs,
  )({ ...node });
}
