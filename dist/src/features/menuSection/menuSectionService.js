"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { menuSection } = prisma_1.prisma;
const menuSectionService = {
    async create(menuSectionData) {
        const { timeRestriction, menuId, ...rest } = menuSectionData;
        const data = {
            ...rest,
            menu: { connect: { id: menuId } },
        };
        if (timeRestriction) {
            data.timeRestriction = { connect: timeRestriction.map((tr) => ({ id: tr.id })) };
        }
        return menuSection.create({ data, include: { timeRestriction: true } });
    },
    async delete(id) {
        try {
            await prisma_1.prisma.$transaction([
                menuSection.update({ data: { timeRestriction: { connect: [] } }, where: { id } }),
                menuSection.delete({ where: { id } })
            ]);
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await menuSection.findUnique({ where: { id }, include: { timeRestriction: true } }) || undefined;
    },
    async list(skip, take) {
        return menuSection.findMany({ skip, take, include: { timeRestriction: true } });
    },
    async listForMenu(menuId, skip, take) {
        return menuSection.findMany({
            where: { menuId }, skip, take, include: { timeRestriction: true },
        });
    },
    async update(menuSectionData) {
        const { timeRestriction, menuId, ...rest } = menuSectionData;
        const data = {
            ...rest,
            menu: { connect: { id: menuId } },
        };
        if (timeRestriction) {
            data.timeRestriction = { connect: timeRestriction.map((l) => ({ id: l.id })) };
        }
        return menuSection.update({ data, where: { id: menuSectionData.id }, include: { timeRestriction: true } });
    },
};
exports.default = menuSectionService;
