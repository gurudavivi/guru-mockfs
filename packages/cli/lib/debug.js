#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const console_1 = require("console");
const fp_1 = require("lodash/fp");
const option_debug_1 = require("./option-debug");
const option_verbosity_1 = require("./option-verbosity");
const program = new commander_1.Command('guru');
(0, fp_1.pipe)(option_verbosity_1.optionVerbosity, (0, option_verbosity_1.optionVerbose)(), (0, option_verbosity_1.optionQuiet)(), (0, option_verbosity_1.optionSilent)(), option_debug_1.optionDebug)(program);
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
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    // log(program.opts())
    // program.error('ddd')
    // program.help()
}));
program.addCommand(new commander_1.Command('build')
    .alias('b')
    .option('-a, --alt', 'alt')
    .action((options) => {
    (0, console_1.log)(options);
    (0, console_1.log)('action');
}));
program.parse();
