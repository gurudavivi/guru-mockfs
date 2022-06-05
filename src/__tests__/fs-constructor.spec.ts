const { log } = console;

const json = {
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

let fs = jest.createMockFromModule('fs');
let path = jest.createMockFromModule('path');
const mock = require('../mockfs').createMockFs(json);

fs = mock.fs;
path = mock.path;
// path.join = jest.fn(() => '/tmp/foo/bar');

describe('mock - path.join', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test('should return a string', () => {
    // @ts-ignore
    const result = path.join('foo', 'bar');
    log('#$', result);
    expect(result).toBe('/foo/bar');
  });

  test('should return a string', () => {
    // @ts-ignore
    const result = fs.readdirSync('/project');
    log('#$', result);
    expect(result).toBe('/foo/bar');
  });
});
