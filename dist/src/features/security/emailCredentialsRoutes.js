"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("src/features/security/userService"));
const httpError_1 = __importDefault(require("src/features/shared/httpError"));
const tokenService_1 = __importDefault(require("src/features/security/tokenService"));
const config_1 = __importDefault(require("src/config/config"));
const securityUtils_1 = __importDefault(require("./securityUtils"));
const basePath = '/login/user-id';
const routes = [
    {
        method: 'POST',
        path: basePath,
        options: {
            auth: false,
        },
        handler: async (req, h) => {
            const payload = req.payload;
            if (!payload?.userId)
                throw httpError_1.default('Authentication not provided').status(401).err();
            const { userId, password } = payload;
            const getMethod = userId.includes('@') ? 'getForEmail' : 'get';
            const user = await userService_1.default[getMethod](userId, true);
            if (config_1.default.nodeEnv === 'development' && !user) {
                throw httpError_1.default('User not found').status(403).err();
            }
            if ((!user || !await securityUtils_1.default.compare(password, user.pwd)))
                throw httpError_1.default('Invalid username or password').status(403).err();
            const token = await tokenService_1.default.create({ owner: user.username, tokenType: 'DEFAULT' });
            const jwtToken = securityUtils_1.default.generateToken(tokenService_1.default.toJwt(token));
            return h.response({ token: jwtToken }).code(201).header('Authorization', jwtToken);
        },
    },
];
exports.default = routes;
