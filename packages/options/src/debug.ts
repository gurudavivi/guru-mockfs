#!/usr/bin/env node

import { Command } from 'commander'
import { log } from 'console'
import { pipe } from 'lodash/fp'

import {
  optionQuiet,
  optionSilent,
  optionVerbose,
  optionVerbosity,
} from './option-verbosity'

const program = new Command('guru')

pipe(optionVerbosity, optionVerbose(), optionQuiet(), optionSilent())(program)

program
  .name('guru')
  .description(require('../package').description)
  .version(require('../package').version)
  .argument('[directory]', 'directory')
  // .option('-v, --verbose', 'verbose')
  // .option('-s, --silent', 'verbose')
  // .option('-q, --quiet', 'verbose')
  .option('-n, --name [value]', 'name', '')
  .option('-l, --list [value...]', 'list of value')
  .option('-i, --interactive', 'interactive', false)
  .action(async () => {
    log(program.opts())
    // program.error('ddd')
    // program.help()
  })

program.addCommand(
  new Command('build')
    .alias('b')
    .option('-a, --alt', 'alt')
    .action((options) => {
      log(options)
      log('action')
    })
)

program.parse()
