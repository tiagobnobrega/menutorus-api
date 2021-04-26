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
const Boom = __importStar(require("@hapi/boom"));
const config_1 = __importDefault(require("src/config/config"));
function httpError(e, causedBy) {
    const err = (e instanceof Error) ? e : new Error(e);
    const error = (e.isBoom) ? e : Boom.internal(err.message);
    return {
        status(statusCode) {
            error.output.statusCode = statusCode;
            return this;
        },
        payload(payload) {
            error.output.payload = { ...error.output.payload, payload };
            return this;
        },
        err(addErrorStack = config_1.default.addErrorStack) {
            error.reformat();
            if (!addErrorStack)
                return error;
            error.output.payload = { ...error.output.payload, stack: error.stack };
            if (causedBy) {
                error.output.payload.causedBy = [
                    ...(error.output.payload.causedBy || []),
                    causedBy.stack,
                    ...(causedBy?.output?.payload?.causedBy || []),
                ];
            }
            return error;
        },
    };
}
exports.default = httpError;
