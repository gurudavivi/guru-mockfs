import { Command } from 'commander';
export declare function optionVerbosity(command: Command): Command;
export declare function optionVerbose(description?: string): (command: Command) => Command;
export declare function optionQuiet(description?: string): (command: Command) => Command;
export declare function optionSilent(description?: string): (command: Command) => Command;
