"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { menuItem, menuItemMedia } = prisma_1.prisma;
const include = { medias: true, icons: true };
const menuItemService = {
    async create(menuItemData) {
        const { medias, icons, menuSectionId, ...rest } = menuItemData;
        const data = {
            ...rest,
            section: { connect: { id: menuSectionId } },
        };
        if (medias) {
            data.medias = { create: medias };
        }
        if (icons) {
            data.icons = { connect: icons.map((el) => ({ id: el.id })) };
        }
        return menuItem.create({ data, include });
    },
    async delete(id) {
        try {
            await prisma_1.prisma.$transaction([
                menuItemMedia.deleteMany({ where: { menuItemId: id } }),
                menuItem.update({ data: { medias: { connect: [] } }, where: { id } }),
                menuItem.delete({ where: { id } })
            ]);
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await menuItem.findUnique({ where: { id }, include }) || undefined;
    },
    async list(skip, take) {
        return menuItem.findMany({ skip, take, include });
    },
    async listForMenuSection(menuSectionId, skip, take) {
        return menuItem.findMany({
            where: { menuSectionId }, skip, take, include,
        });
    },
    async update(menuItemData) {
        const { medias, icons, menuSectionId, ...rest } = menuItemData;
        const data = {
            ...rest,
            section: { connect: { id: menuSectionId } },
        };
        if (medias) {
            data.medias = { connect: medias.map((el) => ({ id: el.id })) };
        }
        if (icons) {
            data.icons = { connect: icons.map((el) => ({ id: el.id })) };
        }
        return menuItem.update({ data, where: { id: menuItemData.id }, include });
    },
};
exports.default = menuItemService;
