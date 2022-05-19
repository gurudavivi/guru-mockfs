import fg from 'fast-glob'
import fs from 'fs-extra'
import f from 'lodash/fp'
import { basename, dirname, join as pathJoin } from 'path'
const { log } = console
import yaml from 'yaml'

import {
  BASIC_IGNORE,
  DEFAULT_IGNORE,
  PACKAGE_MANAGER_FILES,
  WORKSPACE_CONFIG_FILE,
} from './constants'

export async function scanWorkspace(): Promise<any> {
  const workspaceConfig = fs.readFileSync(WORKSPACE_CONFIG_FILE, 'utf8')
  const { packages } = yaml.parse(workspaceConfig)

  if (!packages) {
    return []
  }

  const matchers = f.pipe(
    f.map((item: string) => pathJoin(item, 'package.json'))
  )([...packages])

  return FastGlob([...matchers], {
    onlyFiles: true,
    ignore: [...BASIC_IGNORE, ...DEFAULT_IGNORE],
  })
}

export const getPackageManager = () => {
  const workspaceConfig = fs.readFileSync(WORKSPACE_CONFIG_FILE, 'utf8')
  const { packages } = yaml.parse(workspaceConfig)

  if (!packages) {
    return []
  }

  const fileList = f.pipe(f.map((file) => `./**/*${file}`))([
    ...PACKAGE_MANAGER_FILES.npm,
    ...PACKAGE_MANAGER_FILES.yarn,
    ...PACKAGE_MANAGER_FILES.pnpm,
  ])

  return fg([...fileList], {
    onlyFiles: true,
    ignore: [...BASIC_IGNORE, ...DEFAULT_IGNORE],
  }).then((list: string[]) => {
    return f.pipe(
      f.map((file: string) => {
        return {
          dir: dirname(file),
          npm: PACKAGE_MANAGER_FILES.npm.includes(basename(file)),
          yarn: PACKAGE_MANAGER_FILES.yarn.includes(basename(file)),
          pnpm: PACKAGE_MANAGER_FILES.pnpm.includes(basename(file)),
        }
      }),
      f.map((item) => f.omitBy(f.isEqual(false))(item))
    )([...list])
  })
}

const exec = async () => {
  const res = await getPackageManager()
  log(res)
}

exec()
