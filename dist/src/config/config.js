"use strict";
/**
 * App configuration class. Env files should be parsed using node cli "-r" option or docker env in production.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfg_1 = __importDefault(require("./cfg"));
const appConfig = {
    dbUrl: cfg_1.default('DB_URL').required().string(),
    corsOrigins: cfg_1.default('CORS_ORIGINS', '*').string().split(','),
    addErrorStack: cfg_1.default('ADD_ERROR_STACK', 'false').boolean(),
    jwtSecret: cfg_1.default('JWT_SECRET', 'change_me').string(),
    jwtAlgorithm: cfg_1.default('JWT_ALGORITHM', 'HS256').string(),
    tokenDuration: {
        DEFAULT: cfg_1.default('TOKEN_DURATION_DEFAULT').int(7 * 24 * 1000 * 60 * 60),
        EMAIL: cfg_1.default('TOKEN_DURATION_EMAIL').int(12 * 1000 * 60 * 60),
        RESET: cfg_1.default('TOKEN_DURATION_EMAIL').int(2 * 1000 * 60 * 60),
    },
    nodeEnv: cfg_1.default('NODE_ENV').string('development'),
};
exports.default = appConfig;
