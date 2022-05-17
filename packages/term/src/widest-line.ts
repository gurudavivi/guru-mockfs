import { pipe, reduce, split } from 'lodash/fp'

import { NEWLINE } from './constants'
import stripAnsi from './strip-ansi'

const { max } = Math

export function widestLine(str: string): number {
  return pipe(
    split(NEWLINE),
    reduce((size: number, line: string) => max(size, stripAnsi(line).length), 0)
  )(str)
}

export default widestLine
