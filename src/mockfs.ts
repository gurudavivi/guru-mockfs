import { log } from 'console';
import { flatten as flattenObj, unflatten as unflattenObj } from 'flat';
import { Stats } from 'fs';
import f from 'lodash/fp';
import { ParsedPath } from 'path';

import { DEFAULT_FILESYSTEM } from './constants';
import { NestedNodes, Nodes } from './types/types';
import { getMethods, regexChilds, regexNode, regexTree } from './utils';

export class MockFS {
  private _volume: Nodes = {};

  constructor(obj: Nodes | NestedNodes) {
    this._volume = { ...this.node.build(obj) };
  }

  private node = {
    flatten(obj: NestedNodes): Nodes {
      return flattenObj({ ...obj }, { delimiter: '/', safe: true });
    },
    unflatten(obj: Nodes): NestedNodes {
      return unflattenObj({ ...obj }, { delimiter: '/' });
    },
    sort(node: Nodes): Nodes {
      return f.pipe(
        f.toPairs,
        f.sortBy(f.pipe(f.get(0), f.split('/'), f.slice(0)(-1))),
        f.fromPairs,
      )({ ...node });
    },
    build: (node: Nodes | NestedNodes): Nodes => {
      const volume = f.pipe(
        f.toPairs,
        f.map(([key, value]) => {
          const path = this.path.normalize(key);
          const content = value;
          return [path, content];
        }),
        f.fromPairs,
      )({ ...this.node.flatten({ ...node }) });
      const directories = f.pipe(
        f.keys,
        f.filter((item) => item.startsWith('/')),
        f.map(f.pipe(f.split('/'), f.slice(0)(-1), f.join('/'))),
        f.compact,
        f.uniq,
        f.reduce(
          (volume, name: string) => {
            volume[name] = null;
            return volume;
          },
          { ...volume },
        ),
      )({ ...volume });

      return this.node.sort({
        ...volume,
        ...directories,
        ...DEFAULT_FILESYSTEM,
      });
    },
    size: (path: string): number => {
      if (this.existsSync(path) && this.node.isFile(path)) {
        return Buffer.byteLength(this.node.get(path), 'utf8');
      }

      return 0;
    },
    isDirectory: (path: string): boolean => {
      return f.pipe(f.get(path), f.isNull)(this.volume);
    },
    isFile: (path: string): boolean => {
      return !f.pipe(f.get(path), f.isNull)(this.volume);
    },
    get: (path: string) => {
      return f.get(path)(this.volume);
    },
    set: (path: string, data: string | null): void => {
      this.volume[path] = data;
    },
    remove: (path: string): void => {
      if (this.existsSync(path)) {
        if (this.node.isFile(path)) {
          delete this.volume[path];
        }

        if (this.node.isDirectory(path)) {
          const nodes = f.pipe(
            f.keys,
            f.filter((item: string) => new RegExp(regexTree(path)).test(item)),
          )(this.volume);
          log(nodes);

          nodes.forEach((path: string) => {
            delete this.volume[path];
          });
          // delete this.volume[path];
        }
      }
    },
    root: (path: string) => {
      const x = f.pipe(
        f.keys,
        f.filter((item: string) => new RegExp(regexChilds(path)).test(item)),
        f.map((item: string) => item.match(regexNode)?.slice(1)),
        f.map((item: string) =>
          this.path.normalize(
            item
              .split('/')
              .slice(0, 2)
              .join('/')
              .replace(/^.{0,1}/, ''),
          ),
        ),
        f.compact,
        f.uniq,
      )({ ...this.volume });
      log('aaaaaaa', x);
      return x;
    },
  };

  public get volume(): Nodes {
    return this._volume;
  }

  public get fs(): MockFS {
    return this;
  }

  public get path() {
    return {
      sep: '/',
      delimiter: '/',
      root: '/',
      parse(path: string): ParsedPath {
        return {
          root: '',
          dir: '',
          base: path,
          ext: '',
          name: path,
        };
      },
      format(pathObject: ParsedPath): string {
        return pathObject.base;
      },
      normalize(path: string): string {
        return [`/${path}`]
          .join('')
          .replace(/\/\//g, '/')
          .replace(/\/\.\//g, '/')
          .replace(/\/\//g, '/')
          .replace(/\/\.$/, '')
          .replace(/\/\.\//, '/')
          .replace(/\/\.\.$/, '')
          .replace(/\/\.\.\//, '/')
          .replace(/[./]{2,}/g, '/');
      },
      join(...paths: string[]): string {
        return this.normalize(paths.join('/'));
      },
      relative(to: string): string {
        return to;
      },
      dirname(path: string): string {
        return path.split('/').slice(0, -1).join('/');
      },
      resolve(...paths: string[]): string {
        return paths.join('/');
      },
      isAbsolute(path: string): boolean {
        return path.startsWith('/');
      },
      basename(path: string): string {
        return path.split('/').slice(-1)[0];
      },
    };
  }

  public mkdir(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null) => void,
  ): void {
    this.node.set(path, null);
    callback?.(null);
  }

  public mkdirSync(path: string): void {
    this.node.set(path, null);
  }

  public rmdir(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null) => void,
  ): void {
    if (this.existsSync(path) && this.node.isDirectory(path)) {
      this.node.remove(path);
      callback?.(null);
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public rmdirSync(path: string): void {
    if (this.fs.existsSync(path) && this.node.isDirectory(path)) {
      this.node.remove(path);
    }
  }

  public unlink(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null) => void,
  ): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      this.node.remove(path);
      callback?.(null);
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public unlinkSync(path: string): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      this.node.remove(path);
    }
  }

  public exists(path: string, callback?: (exists: boolean) => void): void {
    callback?.(this.existsSync(path));
  }

  public existsSync(path: string): boolean {
    return this.node.get(path) || this.node.get(path) === null;
  }

  public readdir(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null, files?: string[]) => void,
  ): void {
    if (this.existsSync(path) && this.node.isDirectory(path)) {
      callback?.(null, this.readdirSync(path));
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public readdirSync(path: string): any {
    const basePath = f.isEqual('.')(path) || f.isEqual('/')(path) ? '/' : path;

    if (this.existsSync(basePath) && this.node.isDirectory(basePath)) {
      return f.pipe(
        f.keys,
        f.filter((item) => new RegExp(regexChilds(basePath)).test(item)),
        f.map((item) => item.match(regexNode)?.slice(1)),
        f.flatten,
        f.compact,
        f.uniq,
      )({ ...this.volume });
    }

    throw new Error('ENOENT');
  }

  public readFile(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null, data?: string) => void,
  ): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      callback?.(null, this.node.get(path));
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public readFileSync(path: string): string {
    if (this.existsSync(path) && this.node.isFile(path)) {
      return this.node.get(path);
    }

    throw new Error('ENOENT');
  }

  public writeFile(
    path: string,
    data: string,
    callback?: (err: NodeJS.ErrnoException | null) => void,
  ): void {
    if (
      this.existsSync(this.path.dirname(path)) &&
      !this.node.isDirectory(path)
    ) {
      this.node.set(path, data);
      callback?.(null);
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public writeFileSync(path: string, data: string): void {
    if (
      this.existsSync(this.path.dirname(path)) &&
      !this.node.isDirectory(path)
    ) {
      this.node.set(path, data);
    }
  }

  public appendFile(
    path: string,
    data: string,
    callback?: (err: NodeJS.ErrnoException | null) => void,
  ): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      this.node.set(path, this.node.get(path) + data);
      callback?.(null);
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public appendFileSync(path: string, data: string): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      this.node.set(path, this.node.get(path) + data);
    }
  }

  public realpath(
    path: string,
    callback?: (
      err: NodeJS.ErrnoException | null,
      resolvedPath: string,
    ) => void,
  ): void {
    if (this.existsSync(path) && this.node.isFile(path)) {
      callback?.(null, path);
    } else {
      callback?.(new Error('ENOENT'), path);
    }
  }

  public realpathSync(path: string): string {
    if (this.existsSync(path) && this.node.isFile(path)) {
      return path;
    }

    throw new Error('ENOENT');
  }

  public stat(
    path: string,
    callback?: (err: NodeJS.ErrnoException | null, stats?: Stats) => void,
  ): void {
    const { node } = this;
    if (this.existsSync(path) && this.node.isFile(path)) {
      callback?.(null, {
        isFile() {
          return node.isFile(path);
        },
        isDirectory() {
          return node.isDirectory(path);
        },
        isBlockDevice() {
          return false;
        },
        isCharacterDevice() {
          return false;
        },
        isSymbolicLink() {
          return false;
        },
        isFIFO() {
          return false;
        },
        isSocket() {
          return false;
        },
        dev: 0,
        ino: 0,
        mode: 0,
        nlink: 0,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: node.size(path),
        blksize: 0,
        blocks: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      });
    } else {
      callback?.(new Error('ENOENT'));
    }
  }

  public statSync(path: string): Stats {
    const { node } = this;
    if (this.existsSync(path) && this.node.isFile(path)) {
      return {
        isFile() {
          return node.isFile(path);
        },
        isDirectory() {
          return node.isDirectory(path);
        },
        isBlockDevice() {
          return false;
        },
        isCharacterDevice() {
          return false;
        },
        isSymbolicLink() {
          return false;
        },
        isFIFO() {
          return false;
        },
        isSocket() {
          return false;
        },
        dev: 0,
        ino: 0,
        mode: 0,
        nlink: 0,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: node.size(path),
        blksize: 0,
        blocks: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      };
    }

    throw new Error('ENOENT');
  }
}

export function createMockFs(json: Nodes | NestedNodes) {
  return new MockFS({ ...json });
}

const json = {
  // ...UNIX_LIKE_FILESYSTEM,
  readme: '# Hello World!',
  'index.js': 'console.log("Hello World!");',
  '.app.js': 'console.log("Hello World!");',
  './dir/foo': 'bar',
  './etc': null,
  '/dir/bar': 'baz',
  './project': {
    'package.json': '{ "name": "project" }',
    './src': {
      'index.js': 'console.log("Hello World!");',
      'index.spec.js': 'describe("index.js", () => {});',
    },
    '/test': {
      'test.js': 'describe("index.js", () => {});',
      '/algo': null,
    },
  },
};

// const exec = async () => {
//   //  const fs = createMockFs(json);

//   // log(fs.existsSync('/project'));

//   // fs.writeFileSync('/project/package2.json', '{ "name": "project" }');
//   // fs.rmdirSync('/project');
//   // log(fs.volume);
//   // log(fs.readdirSync('/project'));

//   const me = getMethods(MockFS);

//   const out = me
//     // @ts-ignore
//     .map((method: string) => f.kebabCase(method))
//     .map((method: string) => `fs-${method}.spec.ts`);

//   out.forEach((file: string) => {
//     require('fs').writeFileSync(
//       path.join(__dirname, '__tests__', '__fixtures__', file),
//       '',
//       'utf8',
//     );
//   });

//   require('fs').writeFileSync('me.json', JSON.stringify(out, null, 2), 'utf8');
// };

// exec();
