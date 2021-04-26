"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStrategy = exports.API_AUTH_STATEGY = void 0;
// import { prisma, User } from '@prisma/client';
const config_1 = __importDefault(require("../../config/config"));
exports.API_AUTH_STATEGY = 'API';
// Function will be called on every request using the auth strategy
const validateAPIToken = async (artifacts, request) => {
    const { tokenId } = artifacts;
    if (!tokenId) {
        request.log(['error', 'auth'], 'API auth token error: No tokenId provided');
        return { isValid: false };
    }
    try {
        // Fetch the token from DB to verify it's valid
        // const fetchedToken = await prisma.token.findUnique({
        //   where: {
        //     id: tokenId,
        //   },
        //   include: {
        //     user: true,
        //   },
        // });
    }
    catch (error) {
        request.log(['error', 'auth'], `API auth token error: ${error}`);
        return { isValid: false };
    }
    return { isValid: false };
};
const registerStrategy = (server) => {
    server.auth.strategy(exports.API_AUTH_STATEGY, 'jwt', {
        key: config_1.default.jwtSecret,
        verifyOptions: { algorithms: [config_1.default.jwtAlgorithm] },
        validate: validateAPIToken,
    });
};
exports.registerStrategy = registerStrategy;
