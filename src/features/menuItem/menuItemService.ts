import {
  MenuItem, MenuItemIcon, MenuItemMedia, Prisma,
} from '@prisma/client';
import { convertPrismaError, prisma } from '../shared/prisma';
import { CrudProvider } from '../shared/types';

const { menuItem, menuItemMedia } = prisma;

export type RichMenuItem = MenuItem & { medias: MenuItemMedia[]; icons: MenuItemIcon[] };
export type MenuItemServiceProvider = CrudProvider<RichMenuItem> & {
  listForMenuSection(menuSectionId:number, skip:number, take:number): Promise<RichMenuItem[]>
};
const include = { medias: true, icons: true };
const menuItemService: MenuItemServiceProvider = {
  async create(menuItemData: Omit<RichMenuItem, 'id'>) {
    const {
      medias, icons, menuSectionId, ...rest
    } = menuItemData;
    const data: Prisma.MenuItemCreateInput = {
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
  async delete(id: number) {
    try {
      await prisma.$transaction([
        menuItemMedia.deleteMany({ where: { menuItemId: id } }),
        menuItem.update({ data: { medias: { connect: [] } }, where: { id } }),
        menuItem.delete({ where: { id } })]);
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return await menuItem.findUnique({ where: { id }, include }) || undefined;
  },
  async list(skip:number, take:number) {
    return menuItem.findMany({ skip, take, include });
  },
  async listForMenuSection(menuSectionId:number, skip:number, take:number) {
    return menuItem.findMany({
      where: { menuSectionId }, skip, take, include,
    });
  },
  async update(menuItemData) {
    const {
      medias, icons, menuSectionId, ...rest
    } = menuItemData;
    const data: Prisma.MenuItemUpdateInput = {
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

export default menuItemService;
