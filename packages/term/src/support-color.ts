const sc = require('color-support')

export type SupportColor = '16m' | '256' | 'basic' | false

export function supportColor(): SupportColor {
  if (sc.has16m) {
    return '16m'
  }

  if (sc.has256) {
    return '256'
  }

  if (sc.hasBasic) {
    return 'basic'
  }

  return false
}

export default supportColor
