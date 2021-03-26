"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfg_1 = __importDefault(require("./cfg"));
const appConfig = {
    dbUrl: cfg_1.default('DB_URL').required().string(),
    dbDialect: cfg_1.default('DB_DIALECT').required().string(),
    // REST CONFIGS
    foo: cfg_1.default('FOO').required().string(),
};
exports.default = appConfig;
