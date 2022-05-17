import { join, map, pipe, split, trim } from 'lodash/fp'

import { NEWLINE } from './constants'

export function trimLines(str: string): string {
  return pipe(
    split(NEWLINE),
    map((line: string) => trim(line)),
    join(NEWLINE)
  )(str)
}

export default trimLines
