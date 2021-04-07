import { MenuItemMedia, Prisma, PrismaClient } from '@prisma/client';
import convertPrismaError from '../shared/primsaUtils';
import { CrudProvider } from '../shared/types';

const prisma = new PrismaClient();
const { menuItemMedia } = prisma;

const menuItemMediaService: CrudProvider<MenuItemMedia> = {
  async create(menuSectionData: Omit<MenuItemMedia, 'id'>) {
    const { menuItemId, ...rest } = menuSectionData;
    const data: Prisma.MenuItemMediaCreateInput = {
      ...rest,
      menuItem: { connect: { id: menuItemId } },
    };
    return menuItemMedia.create({ data });
  },
  async delete(id: number) {
    try {
      await prisma.$transaction([
        menuItemMedia.delete({ where: { id } })]);
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return menuItemMedia.findUnique({ where: { id } });
  },
  async list(skip:number, take:number) {
    return menuItemMedia.findMany({ skip, take });
  },
  async update(menuItemMediaData) {
    const { menuItemId, ...rest } = menuItemMediaData;
    const data: Prisma.MenuItemMediaUpdateInput = {
      ...rest,
      menuItem: { connect: { id: menuItemId } },
    };
    return menuItemMedia.update({ data, where: { id: menuItemMediaData.id } });
  },
};

export default menuItemMediaService;
