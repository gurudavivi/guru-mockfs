"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKSPACE_CONFIG_FILE = void 0;
const path_1 = __importDefault(require("path"));
exports.WORKSPACE_CONFIG_FILE = path_1.default.join(process.cwd(), 'pnpm-workspace.yaml');
