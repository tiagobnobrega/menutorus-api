"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("src/config/config"));
const securityUtils_1 = __importDefault(require("src/features/security/securityUtils"));
const prisma_1 = require("../shared/prisma");
const { token } = prisma_1.prisma;
const include = { user: true };
function obfuscateToken(srcToken) {
    return { ...srcToken, user: securityUtils_1.default.obfuscateUser(srcToken.user) };
}
const tokenService = {
    async create(tokenData) {
        const { owner, tokenType, ...rest } = tokenData;
        const duration = config_1.default.tokenDuration[tokenType];
        const data = {
            ...rest,
            expiresAt: new Date(Date.now() + duration),
            tokenType,
            user: { connect: { username: owner } },
        };
        const dbToken = await token.create({ data, include });
        return obfuscateToken(dbToken);
    },
    async delete(id) {
        try {
            await prisma_1.prisma.$transaction([
                token.delete({ where: { id } })
            ]);
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        const dbToken = await token.findUnique({ where: { id }, include });
        return dbToken ? obfuscateToken(dbToken) : undefined;
    },
    async list(skip, take) {
        return token.findMany({ skip, take, include });
    },
    async update(tokenData) {
        const { owner, ...rest } = tokenData;
        const data = {
            ...rest,
            user: { connect: { username: owner } },
        };
        return token.update({ data, where: { id: tokenData.id }, include });
    },
    async listForUser(username, skip, take) {
        return token.findMany({
            where: { owner: username }, skip, take, include,
        });
    },
    toJwt(tokenData) {
        return {
            jti: tokenData.id,
            aud: tokenData.tokenType,
            exp: Math.floor(tokenData.expiresAt.getTime() / 1000),
            sub: tokenData.owner,
        };
    },
};
exports.default = tokenService;
