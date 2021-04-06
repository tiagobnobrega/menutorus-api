import {
  MenuSection, Prisma, PrismaClient, TimeRestriction,
} from '@prisma/client';
import convertPrismaError from '../shared/primsaUtils';
import { CrudProvider } from '../shared/types';

const prisma = new PrismaClient();
const { menuSection } = prisma;

export type RichMenuSection = MenuSection & { timeRestriction: TimeRestriction[] };
export type MenuSectionServiceProvider = CrudProvider<RichMenuSection> & {
  listForMenu(menuId:number, skip:number, take:number): Promise<RichMenuSection[]>
};

const menuSectionService: MenuSectionServiceProvider = {
  async create(menuSectionData: Omit<RichMenuSection, 'id'>) {
    const { timeRestriction, menuId, ...rest } = menuSectionData;
    const data: Prisma.MenuSectionCreateInput = {
      ...rest,
      menu: { connect: { id: menuId } },
    };
    if (timeRestriction) {
      data.timeRestriction = { connect: timeRestriction.map((tr) => ({ id: tr.id })) };
    }
    return menuSection.create({ data, include: { timeRestriction: true } });
  },
  async delete(id: number) {
    try {
      await prisma.$transaction([
        menuSection.update({ data: { timeRestriction: { connect: [] } }, where: { id } }),
        menuSection.delete({ where: { id } })]);
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return menuSection.findUnique({ where: { id }, include: { timeRestriction: true } });
  },
  async list(skip:number, take:number) {
    return menuSection.findMany({ skip, take, include: { timeRestriction: true } });
  },
  async listForMenu(menuId:number, skip:number, take:number) {
    return menuSection.findMany({
      where: { menuId }, skip, take, include: { timeRestriction: true },
    });
  },
  async update(menuSectionData) {
    const { timeRestriction, menuId, ...rest } = menuSectionData;
    const data: Prisma.MenuSectionUpdateInput = {
      ...rest,
      menu: { connect: { id: menuId } },
    };
    if (timeRestriction) {
      data.timeRestriction = { connect: timeRestriction.map((l) => ({ id: l.id })) };
    }
    return menuSection.update({ data, where: { id: menuSectionData.id }, include: { timeRestriction: true } });
  },
};

export default menuSectionService;
