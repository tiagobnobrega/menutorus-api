"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../shared/prisma");
const { business } = prisma_1.prisma;
const businessService = {
    async create(businessData) {
        return business.create({ data: businessData });
    },
    async delete(id) {
        try {
            await business.delete({ where: { id } });
        }
        catch (error) {
            throw prisma_1.convertPrismaError(error);
        }
    },
    async get(id) {
        return await business.findUnique({ where: { id } }) || undefined;
    },
    async list(skip, take) {
        return business.findMany({ skip, take });
    },
    async update(businessData) {
        return business.update({ data: businessData, where: { id: businessData.id } });
    },
};
exports.default = businessService;
