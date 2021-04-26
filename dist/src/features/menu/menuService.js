"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { menu } = prisma_1.prisma;
const menuService = {
    async create(menuData) {
        const { langs, businessId, ...menuRootData } = menuData;
        const data = {
            ...menuRootData,
            business: { connect: { id: businessId } },
            langs: { connect: (langs || []).map((l) => ({ id: l.id })) },
        };
        return await menu.create({ data, include: { langs: true } });
    },
    async delete(id) {
        try {
            await menu.delete({ where: { id } });
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await menu.findUnique({ where: { id }, include: { langs: true } }) || undefined;
    },
    async list(skip, take) {
        return menu.findMany({ skip, take, include: { langs: true } });
    },
    async update(menuData) {
        const { langs, businessId, ...menuRootData } = menuData;
        const data = {
            ...menuRootData,
            business: { connect: { id: businessId } },
        };
        if (langs) {
            data.langs = { connect: langs.map((l) => ({ id: l.id })) };
        }
        return menu.update({ data, where: { id: menuData.id }, include: { langs: true } });
    },
};
exports.default = menuService;
