import FastGlob from 'fast-glob'
import fs from 'fs-extra'
import f, { first, pipe, split } from 'lodash/fp'
import path, { join as pathJoin } from 'path'
import type { PackageJson } from 'type-fest'
const { log } = console
import Bluebird from 'bluebird'
import yaml from 'yaml'

import { WORKSPACE_CONFIG_FILE } from './constants'

export async function scanWorkspace(): Promise<any> {
  const workspaceConfig = fs.readFileSync(WORKSPACE_CONFIG_FILE, 'utf8')
  const { packages } = yaml.parse(workspaceConfig)

  if (!packages) {
    return []
  }

  const matchers = f.pipe(
    f.map((item: string) => pathJoin(item, 'package.json'))
  )([...packages])

  return FastGlob([...matchers, '!**/node_modules/**'], {
    onlyFiles: true,
  })
}

const exec = async () => {
  const res = await getWorkspacePackages()
  log(res)
}

exec()
