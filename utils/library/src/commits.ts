/* eslint-disable no-unused-expressions */
import chalk from 'chalk'
import { exec } from 'child_process'
import { randomBytes } from 'crypto'
import fs from 'fs'
import f from 'lodash/fp'
import path from 'path'
import { join as pathJoin } from 'path'

const { log } = console

const c = chalk

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

const cycle = async () => {
  fs.existsSync(DIR) || fs.mkdirSync(DIR)

  await Promise.all([
    ...[...f.range(0, 10)].map(async () => {
      return fs.promises.writeFile(
        path.join(DIR, Date.now().toString()),
        randomBytes(1024 * 1000).toString('hex'),
        'utf8'
      )
    }),
  ])

  await execute(`git add . && git commit -m '${Date.now()}'`).then((res) =>
    log(res)
  )
  await execute(`git push -f`).then((res) => log(res))

  //   await execute(`rm -rf ${DIR}`).then((res) => log(res))
}

cycle()
