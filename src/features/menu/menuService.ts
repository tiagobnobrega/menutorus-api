import {
  Lang, Menu, Prisma, PrismaClient,
} from '@prisma/client';
import { convertPrismaError, prisma } from '../shared/prisma';
import { CrudProvider } from '../shared/types';

const { menu } = prisma;

export interface RichMenu extends Menu { langs: Lang[] }
export type BusinessServiceProvider = CrudProvider<RichMenu>;

const menuService: BusinessServiceProvider = {
  async create(menuData: Omit<RichMenu, 'id'>) {
    const { langs, businessId, ...menuRootData } = menuData;
    const data = {
      ...menuRootData,
      business: { connect: { id: businessId } },
      langs: { connect: (langs || []).map((l) => ({ id: l.id })) },
    };
    return await menu.create({ data, include: { langs: true } });
  },
  async delete(id: number) {
    try {
      await menu.delete({ where: { id } });
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return await menu.findUnique({ where: { id }, include: { langs: true } }) || undefined;
  },
  async list(skip:number, take:number) {
    return menu.findMany({ skip, take, include: { langs: true } });
  },
  async update(menuData) {
    const { langs, businessId, ...menuRootData } = menuData;
    const data: Prisma.MenuUpdateInput = {
      ...menuRootData,
      business: { connect: { id: businessId } },
    };
    if (langs) {
      data.langs = { connect: langs.map((l) => ({ id: l.id })) };
    }
    return menu.update({ data, where: { id: menuData.id }, include: { langs: true } });
  },
};

export default menuService;
