"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { menuItemMedia } = prisma_1.prisma;
const menuItemMediaService = {
    async create(menuSectionData) {
        const { menuItemId, ...rest } = menuSectionData;
        const data = {
            ...rest,
            menuItem: { connect: { id: menuItemId } },
        };
        return menuItemMedia.create({ data });
    },
    async delete(id) {
        try {
            await prisma_1.prisma.$transaction([
                menuItemMedia.delete({ where: { id } })
            ]);
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await menuItemMedia.findUnique({ where: { id } }) || undefined;
    },
    async list(skip, take) {
        return menuItemMedia.findMany({ skip, take });
    },
    async update(menuItemMediaData) {
        const { menuItemId, ...rest } = menuItemMediaData;
        const data = {
            ...rest,
            menuItem: { connect: { id: menuItemId } },
        };
        return menuItemMedia.update({ data, where: { id: menuItemMediaData.id } });
    },
};
exports.default = menuItemMediaService;
