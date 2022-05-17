/* eslint-disable no-control-regex */

export function stripColor(str: string): string {
  return str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '')
}

export default stripColor
