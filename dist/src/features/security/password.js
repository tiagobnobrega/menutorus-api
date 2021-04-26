"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    async hash(pwd, rounds = 10) {
        return bcrypt_1.default.hash(pwd, rounds);
    },
    async compare(data, encrypted) {
        return bcrypt_1.default.compare(data, encrypted);
    },
};
