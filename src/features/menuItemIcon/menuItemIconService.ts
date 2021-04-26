import { MenuItemIcon } from '@prisma/client';
import { convertPrismaError, prisma } from '../shared/prisma';
import { CrudProvider } from '../shared/types';

const { menuItemIcon } = prisma;

const menuItemMediaIcon: CrudProvider<MenuItemIcon> = {
  async create(menuIconData: Omit<MenuItemIcon, 'id'>) {
    return menuItemIcon.create({ data: menuIconData });
  },
  async delete(id: number) {
    try {
      menuItemIcon.delete({ where: { id } });
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return await menuItemIcon.findUnique({ where: { id } }) || undefined;
  },
  async list(skip:number, take:number) {
    return menuItemIcon.findMany({ skip, take });
  },
  async update(menuIconData) {
    return menuItemIcon.update({ data: menuIconData, where: { id: menuIconData.id } });
  },
};

export default menuItemMediaIcon;
