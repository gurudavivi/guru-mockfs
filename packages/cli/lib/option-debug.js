"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionDebug = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const console_1 = require("console");
const c = chalk_1.default;
function optionDebug(command) {
    const option = new commander_1.Option('--debug', 'debug mode')
        .default(false)
        .hideHelp(true);
    command.addOption(option);
    command.hook('preAction', (thisCommand) => {
        if (thisCommand.opts().debug) {
            if (thisCommand.args.length) {
                (0, console_1.log)(thisCommand.args);
            }
            if (thisCommand.opts().length) {
                (0, console_1.log)(thisCommand.opts());
            }
        }
    });
    return command;
}
exports.optionDebug = optionDebug;
