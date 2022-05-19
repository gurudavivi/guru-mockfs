"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionSilent = exports.optionQuiet = exports.optionVerbose = exports.optionVerbosity = void 0;
const commander_1 = require("commander");
const fp_1 = require("lodash/fp");
const verbosity = {
    silent: 0,
    quiet: 1,
    normal: 2,
    verbose: 3,
};
function conflicts(option) {
    option.conflicts([
        ...(0, fp_1.pipe)(fp_1.keys, (0, fp_1.filter)((key) => !(0, fp_1.isEqual)(key)(option.name())))(Object.assign({}, verbosity)),
    ]);
    return option;
}
function optionVerbosity(command) {
    const option = new commander_1.Option('--verbosity', 'define the verbosity level')
        .choices((0, fp_1.keys)(verbosity))
        .conflicts((0, fp_1.keys)(verbosity))
        .default(verbosity.normal)
        .hideHelp(true);
    command.addOption(option);
    command.hook('preAction', (thisCommand) => {
        const level = (0, fp_1.pipe)(fp_1.keys, (0, fp_1.find)((key) => (0, fp_1.keys)(Object.assign({}, verbosity)).includes(key)))(Object.assign({}, thisCommand.opts()));
        if (level) {
            thisCommand.setOptionValue('verbosity', {
                name: level,
                level: verbosity[level],
            });
        }
    });
    return command;
}
exports.optionVerbosity = optionVerbosity;
function optionVerbose(description) {
    return (command) => {
        const option = new commander_1.Option('-v, --verbose', description || 'show all logs');
        conflicts(option);
        command.addOption(option);
        return command;
    };
}
exports.optionVerbose = optionVerbose;
function optionQuiet(description) {
    return (command) => {
        const option = new commander_1.Option('-q, --quiet', description || 'only show essential messages');
        conflicts(option);
        command.addOption(option);
        return command;
    };
}
exports.optionQuiet = optionQuiet;
function optionSilent(description) {
    return (command) => {
        const option = new commander_1.Option('-s, --silent', description || 'does not emit any log');
        conflicts(option);
        command.addOption(option);
        return command;
    };
}
exports.optionSilent = optionSilent;
