"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("src/features/shared/httpError"));
const httpErrorTransformerPlugin = {
    name: 'httpErrorTransformer',
    version: '1.0.0',
    async register(server) {
        server.ext('onPreResponse', (request, h) => {
            const { response } = request;
            if (!response.isBoom) {
                return h.continue;
            }
            const error = response;
            // console.log('@@@@@@@@@@@onPreResponse ERROR:', { error });
            return httpError_1.default(error).err();
        });
    },
};
exports.default = httpErrorTransformerPlugin;
