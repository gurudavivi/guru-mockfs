/* eslint-disable no-unused-expressions */
import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { exec } from 'child_process'
import { log } from 'console'
import { randomBytes, randomInt } from 'crypto'
import fs from 'fs'
import f from 'lodash/fp'
import { join as pathJoin } from 'path'
import path, { dirname } from 'path'

const c = chalk

export const createFile = async (path: string, megabytes = 1) => {
  if (!fs.existsSync(dirname(path))) {
    fs.mkdirSync(dirname(path), { recursive: true })
  }

  const ws = fs.createWriteStream(path)

  const cycles = megabytes * 8

  for (let index = 0; index < cycles; index++) {
    ws.write(randomBytes(1024))
  }

  ws.close()
}

const generate = async (root: string) => {
  const DIR_LEN = 5
  const FIL_LEN = 20

  const count = randomInt(DIR_LEN) + 1

  f.range(1, count + 1).forEach(() => {
    const dir = path.join(root, dirname(faker.system.filePath()))
    const files = f
      .range(1, randomInt(FIL_LEN + 1))
      .map(() => faker.system.fileName())
    log(c.magenta(dir), files)

    files.forEach(async (file) => {
      await createFile(path.join(dir, file), randomInt(20) + 1)
    })
  })
}

export const execute = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }

      if (stderr) {
        reject(stderr)
      }

      resolve(stdout)
    })
  })
}

const DIR = path.join(process.cwd(), 'data')

const create = async () => {
  fs.existsSync(DIR) || fs.mkdirSync(DIR)

  await generate(DIR)
}

const exec22 = async () => {
  //
  await create()
}

exec22()
