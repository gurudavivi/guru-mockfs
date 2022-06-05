import fg from 'fast-glob';
import fs from 'fs';
import f from 'lodash/fp';
import path from 'path';

const { log } = console;

export const cloneLinuxDirectoryStructure = async (): Promise<any> => {
  const writeStream = fs.createWriteStream(path.join(__dirname, 'linux.json'));
  const readStream = fg.stream(['/**/*'], {
    onlyDirectories: true,
    deep: 3,
    suppressErrors: true,
  });

  const list: string[] = [];

  readStream.on('data', (directory: string) => {
    list.push(directory);
    log(directory);
  });

  readStream.on('end', () => {
    writeStream.write(
      JSON.stringify(
        f.sortBy(f.pipe(f.get(0), f.split('/'), f.slice(0)(-1)))(list),
      ),
    );
    writeStream.end();
  });
};

const exec = async () => {
  await cloneLinuxDirectoryStructure();
};

exec();
