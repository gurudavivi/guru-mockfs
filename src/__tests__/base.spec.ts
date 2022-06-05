// // jest.mock('fs');
// import fs from 'fs';
// // @ts-ignore
// import { patchFs } from 'fs-monkey';
// import { vol } from 'memfs';

// vol.fromJSON({ '/dir/foo': 'bar' });
// patchFs(vol);

// // import { writeFileHello } from '../debug';

// jest.mock('fs');

// // // @ts-ignore
// // fs.readFileSync = jest.fn(() => 'Hello World!');

// // // @ts-ignore
// // fs.writeFileSync = jest.fn(() => console.log('Hello World!'));

// describe('mock - path.join', () => {
//   beforeEach(() => {
//     // vol.reset.bind(vol);
//   });

//   test('should return a string', () => {
//     // vol.fromJSON({ 'hello.txt': 'pizza' });

//     // writeFileHello();

//     console.log('\n\n', fs.readdirSync('/dir/foo'));

//     expect(true).toEqual(true);
//     // expect(fs.readFileSync('hello.txt', 'utf8')).toBe('Hello World!');
//   });
// });
