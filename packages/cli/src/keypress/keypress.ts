/* eslint-disable no-unused-expressions */
import color from '@guru/color';
import { log } from 'console';
import fs from 'fs';
import f from 'lodash/fp';
import path from 'path';
import { stdin, stdout } from 'process';
import readline, { Key } from 'readline';

import { KeyPressHandler } from './types';

function keyBind(key: string) {
  return (handler?: KeyPressHandler) =>
    (...args: any[]) => {
      if (handler) {
        const keyA = f.pipe(f.toLower, f.trim, f.split('+'))(key);

        const keyB = f.pipe(
          f.pick(['name', 'ctrl', 'meta', 'shift']),
          f.omitBy(f.isEqual(false)),
          f.entries,
          f.reduce((acc: string[], cur) => {
            const [key, value] = cur;
            const element = f.isBoolean(value) ? key : value;
            return [...acc, f.toLower(element)];
          }, []),
        )({ ...args[1] });

        if (!f.difference(keyA, keyB).length) {
          handler(args[1]);
        }
      }
    };
}

export function keyPressEvent() {
  const rl = readline.createInterface({
    terminal: false,
    input: stdin,
    output: stdout,
  });

  let canExit = true;

  const control = {
    canExit(value: boolean) {
      canExit = value;
      return control;
    },
  };

  if (stdin.isTTY) stdin.setRawMode(true);
  readline.emitKeypressEvents(stdin, rl);

  stdin.on('keypress', (_, key: Key) => {
    if (key.ctrl && key.name === 'c') {
      canExit && process.exit(0);
    }
  });

  return {
    canExit(value: boolean) {
      canExit = value;
      return control;
    },
    on(keyPress: string, handler: KeyPressHandler) {
      stdin.on('keypress', keyBind(keyPress)(handler));
    },
  };
}
