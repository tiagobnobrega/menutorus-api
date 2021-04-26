"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = __importStar(require("faker"));
const securityUtils_1 = __importDefault(require("../../src/features/security/securityUtils"));
// type DataParam = Parameters<PrismaClient['business']['create']>[0]['data'];
const randomMedia = (mainMedia) => ({ mainMedia, contentType: 'image/jpeg', uri: `${faker.image.food(400, 300)}?${faker.random.number()}` });
const userData = {
    name: 'John Doe',
    username: 'jdoe',
    pwd: '123456',
    email: 'jdoe@email.com',
    businesses: {
        create: [{
                title: 'Sample Business',
                //* menus
                menus: {
                    create: [{
                            title: 'Menu Principal',
                            priceUnit: 'R$',
                            //* langs
                            langs: { connect: { id: 'pt-BR' } },
                            //* sections
                            sections: {
                                create: [
                                    {
                                        title: 'Entrada',
                                        order: 0,
                                        displayMode: 'list',
                                        menuItems: {
                                            create: [{
                                                    order: 1,
                                                    title: 'Ceasar Salad',
                                                    price: 10.25,
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                    medias: { create: [randomMedia(true)] },
                                                }, {
                                                    order: 2,
                                                    title: 'Salada Tropical',
                                                    price: 230.25,
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                    medias: { create: [true, false, false].map((main) => randomMedia(main)) },
                                                }],
                                        },
                                    },
                                    {
                                        title: 'Prato Principal',
                                        order: 1,
                                        displayMode: 'list',
                                        menuItems: {
                                            create: [
                                                {
                                                    title: 'Bife de Panela',
                                                    price: 230.25,
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                },
                                                ...[1, 2, 3, 4].map((v) => ({
                                                    order: v,
                                                    title: faker.company.catchPhrase().slice(0, 80),
                                                    price: faker.random.float(500),
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                })),
                                            ],
                                        },
                                    },
                                    {
                                        title: 'Sobremesa',
                                        order: 2,
                                        displayMode: 'list',
                                        menuItems: {
                                            create: [
                                                {
                                                    title: 'Torta',
                                                    price: 110.5,
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                },
                                                ...[1, 2, 3, 4].map((v) => ({
                                                    order: v,
                                                    title: faker.company.catchPhrase().slice(0, 80),
                                                    price: faker.random.float(500),
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                })),
                                            ],
                                        },
                                    },
                                    {
                                        title: 'Bebidas',
                                        order: 3,
                                        displayMode: 'list',
                                        menuItems: {
                                            create: [
                                                ...[1, 2, 3, 4].map((v) => ({
                                                    order: v,
                                                    title: faker.company.catchPhrase().slice(0, 80),
                                                    price: faker.random.float(500),
                                                    abstract: faker.lorem.sentence(5).slice(0, 140),
                                                    details: faker.lorem.sentence(10).slice(0, 500),
                                                })),
                                            ],
                                        },
                                    },
                                ],
                            },
                        }],
                },
            }],
    },
};
async function seedSample(prisma) {
    //! lang and timeRestrictions must run before this
    userData.pwd = await securityUtils_1.default.hash(userData.pwd);
    await prisma.user.create({ data: userData });
}
exports.default = seedSample;
