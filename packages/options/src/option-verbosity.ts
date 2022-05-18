import { Command, Option } from 'commander'
import { filter, find, isEqual, keys, pipe } from 'lodash/fp'

const verbosity = {
  silent: 0,
  quiet: 1,
  normal: 2,
  verbose: 3,
}

function conflicts(option: Option): Option {
  option.conflicts([
    ...pipe(
      keys,
      filter((key) => !isEqual(key)(option.name()))
    )({ ...verbosity }),
  ])

  return option
}

export function optionVerbosity(command: Command): Command {
  const option = new Option('--verbosity', 'define the verbosity level')
    .choices(keys(verbosity))
    .conflicts(keys(verbosity))
    .default(verbosity.normal)
    .hideHelp(true)

  command.addOption(option)

  command.hook('preAction', (thisCommand) => {
    const level = pipe(
      keys,
      find((key) => keys({ ...verbosity }).includes(key))
    )({ ...thisCommand.opts() })
    if (level) {
      thisCommand.setOptionValue('verbosity', {
        name: level,
        level: verbosity[level],
      })
    }
  })

  return command
}

export function optionVerbose(description?: string) {
  return (command: Command): Command => {
    const option = new Option(
      '-v, --verbose',
      description || 'define the verbosity level'
    )
    conflicts(option)
    command.addOption(option)
    return command
  }
}

export function optionQuiet(description?: string) {
  return (command: Command): Command => {
    const option = new Option(
      '-q, --quiet',
      description || 'define the verbosity level'
    )
    conflicts(option)
    command.addOption(option)
    return command
  }
}

export function optionSilent(description?: string) {
  return (command: Command): Command => {
    const option = new Option(
      '-s, --silent',
      description || 'define the verbosity level'
    )
    conflicts(option)
    command.addOption(option)
    return command
  }
}
