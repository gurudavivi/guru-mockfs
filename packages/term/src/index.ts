import stripAnsi from './strip-ansi'
import colorSupport from './strip-color'
import stripColor from './support-color'
import trimLines from './trim-lines'
import widestLine from './widest-line'

export * from './strip-ansi'
export * from './strip-color'
export * from './support-color'
export * from './trim-lines'
export * from './widest-line'

export default {
  ...colorSupport,
  ...stripAnsi,
  ...stripColor,
  ...widestLine,
  ...trimLines,
}
