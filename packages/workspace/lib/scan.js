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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacePackages = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fp_1 = __importDefault(require("lodash/fp"));
const path_1 = require("path");
const { log } = console;
const yaml_1 = __importDefault(require("yaml"));
const constants_1 = require("./constants");
function getWorkspacePackages() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceConfig = fs_extra_1.default.readFileSync(constants_1.WORKSPACE_CONFIG_FILE, 'utf8');
        const { packages } = yaml_1.default.parse(workspaceConfig);
        if (!packages) {
            return [];
        }
        const matchers = fp_1.default.pipe(fp_1.default.map((item) => (0, path_1.join)(item, 'package.json')))([...packages]);
        return (0, fast_glob_1.default)([...matchers, '!**/node_modules/**'], {
            onlyFiles: true,
        });
    });
}
exports.getWorkspacePackages = getWorkspacePackages;
const exec = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield getWorkspacePackages();
    log(res);
});
exec();
