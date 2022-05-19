import path from 'path'

export const BASIC_IGNORE = ['**/node_modules/**', '**/bower_components/**']
export const DEFAULT_IGNORE = ['**/test/**', '**/tests/**', '**/__tests__/**']

export const WORKSPACE_CONFIG_FILE = path.join(
  process.cwd(),
  'pnpm-workspace.yaml'
)

export const PACKAGE_MANAGER_FILES = {
  npm: ['package-lock.json', 'npm-shrinkwrap.json'],
  yarn: ['yarn.lock'],
  pnpm: ['pnpm-lock.yaml'],
}
