"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { menuItemIcon } = prisma_1.prisma;
const menuItemMediaIcon = {
    async create(menuIconData) {
        return menuItemIcon.create({ data: menuIconData });
    },
    async delete(id) {
        try {
            menuItemIcon.delete({ where: { id } });
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await menuItemIcon.findUnique({ where: { id } }) || undefined;
    },
    async list(skip, take) {
        return menuItemIcon.findMany({ skip, take });
    },
    async update(menuIconData) {
        return menuItemIcon.update({ data: menuIconData, where: { id: menuIconData.id } });
    },
};
exports.default = menuItemMediaIcon;
