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
exports.registerAuthStrategy = exports.AUTH_STRATEGIES = void 0;
const Jwt = __importStar(require("@hapi/jwt"));
const client_1 = require("@prisma/client");
const tokenService_1 = __importDefault(require("src/features/security/tokenService"));
const config_1 = __importDefault(require("../../config/config"));
const checkToken = async (jwtArtifacts, tokenTypes) => {
    // Fetch the token from DB to verify it's valid
    const { jti } = jwtArtifacts.decoded.payload;
    if (!jti) {
        throw new Error('Malformed jwt token: jti not informed');
    }
    // TODO validate token without going to db after improving token security
    const dbToken = await tokenService_1.default.get(jti);
    if (!dbToken) {
        return { isValid: false };
    }
    //! No need to validate this if token can be trusted on its own
    const isTypeValid = tokenTypes.includes(dbToken.tokenType);
    const isDurationValid = dbToken.expiresAt.getTime() > Date.now();
    if (!isTypeValid || !isDurationValid) {
        await tokenService_1.default.delete(dbToken.id);
        return { isValid: false };
    }
    return {
        isValid: true,
        credentials: dbToken.user,
    };
};
// Function will be called on every request using the auth strategy
const validateAPIToken = async (artifacts, request) => {
    try {
        return await checkToken(artifacts, [client_1.TokenType.DEFAULT]);
    }
    catch (error) {
        request.log(['error', 'auth'], `API auth token error: ${error}`);
        return { isValid: false };
    }
};
const validateConfirmationToken = async (artifacts, request) => {
    try {
        return await checkToken(artifacts, [client_1.TokenType.EMAIL]);
    }
    catch (error) {
        request.log(['error', 'auth'], `API auth token error: ${error}`);
        return { isValid: false };
    }
};
exports.AUTH_STRATEGIES = {
    API: 'API',
    CONFIRMATION: 'CONFIRMATION',
};
// TODO keys might be a function to implement secret rotation
const registerAuthStrategy = async (server) => {
    await server.register(Jwt);
    //* API strategy (default)
    const strategyOpts = {
        keys: config_1.default.jwtSecret,
        verify: {
            sub: false,
            nbf: false,
            timeSkewSec: 0,
            iss: false,
            aud: client_1.TokenType.DEFAULT.toString(),
            exp: true, //! !!!! NumericDate (Secs / not Milliseconds from epoch),
        },
    };
    server.auth.strategy(exports.AUTH_STRATEGIES.API, 'jwt', {
        ...strategyOpts,
        validate: validateAPIToken,
    });
    //* Confrimation strategy
    const confirmOpts = strategyOpts;
    confirmOpts.verify.aud = client_1.TokenType.EMAIL;
    server.auth.strategy(exports.AUTH_STRATEGIES.CONFIRMATION, 'jwt', {
        ...confirmOpts,
        validate: validateConfirmationToken,
    });
    server.auth.default(exports.AUTH_STRATEGIES.API);
};
exports.registerAuthStrategy = registerAuthStrategy;
