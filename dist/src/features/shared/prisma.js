"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaPlugin = exports.prisma = exports.convertPrismaError = void 0;
const runtime_1 = require("@prisma/client/runtime");
const httpError_1 = __importDefault(require("src/features/shared/httpError"));
const client_1 = require("@prisma/client");
function convertPrismaError(error) {
    if (error instanceof runtime_1.PrismaClientValidationError) {
        // TODO: This could be improved in future versions of prisma client: https://github.com/prisma/prisma/issues/5040
        return httpError_1.default('Prisma error, id probably not found.', error).status(400).err();
    }
    if (error instanceof runtime_1.PrismaClientKnownRequestError) {
        return httpError_1.default('Prisma error, probably constraint violation. Was it a delete attempt ?', error).status(400).err();
    }
    return error;
}
exports.convertPrismaError = convertPrismaError;
exports.prisma = new client_1.PrismaClient();
// plugin to instantiate Prisma Client
exports.prismaPlugin = {
    name: 'prisma',
    async register(server) {
        // eslint-disable-next-line no-param-reassign
        server.app.prisma = exports.prisma;
        // Close DB connection after the server's connection listeners are stopped
        // Related issue: https://github.com/hapijs/hapi/issues/2839
        server.ext({
            type: 'onPostStop',
            method: async (hapiServer) => {
                hapiServer.app.prisma.$disconnect();
            },
        });
    },
};
