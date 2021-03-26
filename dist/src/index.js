"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const Hapi = require('@hapi/hapi');
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
    console.log({ config: config_1.default });
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
