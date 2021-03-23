import { Optional } from 'utility-types';
import { MenuItemMedia, PrismaClient } from '@prisma/client';
import * as faker from 'faker';

type DataParam = Parameters<PrismaClient['business']['create']>[0]['data'];

const randomMedia = (mainMedia:boolean):Optional<MenuItemMedia, 'id'|'menuItemId'> => (
  { mainMedia, contentType: 'image/jpeg', uri: `${faker.image.food(400, 300)}?${faker.random.number()}` }
);

const businessData:DataParam = {
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
                title: 'Ceasar Salad',
                price: 10.25,
                abstract: faker.lorem.sentence(5).slice(0, 140),
                details: faker.lorem.sentence(10).slice(0, 500),
                medias: { create: [randomMedia(true)] },
              }, {
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
                ...[1, 2, 3, 4].map(() => ({
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
                ...[1, 2, 3, 4].map(() => ({
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
                ...[1, 2, 3, 4].map(() => ({
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
};

async function seedSample(prisma:PrismaClient):Promise<void> {
  //! lang and timeRestrictions must run before this
  await prisma.business.create({ data: businessData });
}

export default seedSample;
