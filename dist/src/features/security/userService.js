"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usernameRegex = exports.USERNAME_REGEX_STR = void 0;
const securityUtils_1 = __importDefault(require("src/features/security/securityUtils"));
const prisma_1 = require("../shared/prisma");
exports.USERNAME_REGEX_STR = '^[\\d._a-z]{3,}$';
exports.usernameRegex = new RegExp(exports.USERNAME_REGEX_STR);
const userService = {
    async register(userData) {
        //* check username for allowed characters
        if (!exports.usernameRegex.test(userData.username)) {
            throw new Error(`Invalid username provided. Allowed pattern is: ${exports.USERNAME_REGEX_STR}`);
        }
        //* check if username is taken
        let someUser = await this.get(userData.username);
        if (someUser) {
            throw new Error(`Username "${userData.username}" already taken`);
        }
        //* check if e-mail is in use
        someUser = await this.getForEmail(userData.email);
        if (someUser) {
            throw new Error(`Email "${userData.email}" already in use by another user`);
        }
        const data = { ...userData, isVerified: false };
        data.pwd = await securityUtils_1.default.hash(data.pwd);
        const dbUser = await prisma_1.prisma.user.create({ data });
        return securityUtils_1.default.obfuscateUser(dbUser);
    },
    async setVerified(username, isVerified) {
        const dbUser = await prisma_1.prisma.user.update({ data: { isVerified }, where: { username } });
        return securityUtils_1.default.obfuscateUser(dbUser);
    },
    async changeEmail(username, newEmail) {
        //* check if new e-mail is in use
        const someUser = await this.getForEmail(newEmail);
        if (someUser) {
            throw new Error(`Email "${newEmail}" already in use by another user`);
        }
        const dbUser = await prisma_1.prisma.user.update({ data: { emailOnSwitch: newEmail }, where: { username } });
        return securityUtils_1.default.obfuscateUser(dbUser);
    },
    async changePassword(username, oldPassword, newPassword) {
        const user = await prisma_1.prisma.user.findUnique({ where: { username } });
        if (!user)
            throw new Error(`Could not find user with username: ${username}`);
        if (!user.isVerified)
            throw new Error(`User ${username} is not verified and can't change password`);
        //* check old password
        if (!await securityUtils_1.default.compare(oldPassword, user.pwd))
            throw new Error('Old password invalid');
        const newPwdHash = await securityUtils_1.default.hash(newPassword);
        const dbUser = await prisma_1.prisma.user.update({ data: { pwd: newPwdHash }, where: { username } });
        return securityUtils_1.default.obfuscateUser(dbUser);
    },
    async delete(username) {
        await prisma_1.prisma.user.delete({ where: { username } });
    },
    async get(username, preventObfuscation = false) {
        const user = await prisma_1.prisma.user.findUnique({ where: { username } });
        if (user) {
            return preventObfuscation ? user : securityUtils_1.default.obfuscateUser(user);
        }
        return undefined;
    },
    async getForEmail(email, preventObfuscation = false) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (user) {
            return preventObfuscation ? user : securityUtils_1.default.obfuscateUser(user);
        }
        return undefined;
    },
    async list(skip, take) {
        const users = await prisma_1.prisma.user.findMany({ skip, take });
        return users.map((e) => securityUtils_1.default.obfuscateUser(e));
    },
    obfuscateEmail(email) {
        const [prefix, suffix] = email.split('@');
        return `${prefix.slice(0, 1)}***${prefix.slice(-3)}@${suffix}`;
    },
    async update(userData) {
        const { username, ...userDataRest } = userData;
        const dbUser = await prisma_1.prisma.user.update({ where: { username }, data: userDataRest });
        return securityUtils_1.default.obfuscateUser(dbUser);
    },
};
exports.default = userService;
