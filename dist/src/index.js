"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = __importStar(require("@hapi/hapi"));
const httpErrorTransformerPlugin_1 = __importDefault(require("./plugins/httpErrorTransformerPlugin"));
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./routes"));
const prisma_1 = require("./features/shared/prisma");
const authStrategy_1 = require("./features/security/authStrategy");
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: { origin: config_1.default.corsOrigins, credentials: true },
        },
    });
    // ==== PLUGINS ====
    await server.register([{
            plugin: httpErrorTransformerPlugin_1.default,
            // options: {},
        }, { plugin: prisma_1.prismaPlugin }]);
    // ==== AUTH ====
    await authStrategy_1.registerAuthStrategy(server);
    // ==== ROUTES =====
    server.realm.modifiers.route.prefix = '/api';
    server.route(routes_1.default);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
// === Handle process stop properly ===
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});
// === ===
init().catch((error) => {
    console.error('Unexpected error on startup', error);
    process.kill(process.pid, 'SIGINT');
});
