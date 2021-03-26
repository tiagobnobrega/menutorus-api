"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const langs_1 = __importDefault(require("./seedData/langs"));
const timeRestrictions_1 = __importDefault(require("./seedData/timeRestrictions"));
const prisma = new client_1.PrismaClient();
async function main() {
    const langsPromises = langs_1.default.map((l) => prisma.lang.upsert({
        where: { id: l.id },
        update: {},
        create: l,
    }));
    await Promise.all(langsPromises);
    const timeRestrictionPromises = timeRestrictions_1.default.map((tr) => prisma.timeRestriction.upsert({
        where: { code: tr.code },
        update: {},
        create: tr,
    }));
    await Promise.all(timeRestrictionPromises);
}
main()
    .catch((error) => {
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
