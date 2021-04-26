import { Business } from '@prisma/client';
import { convertPrismaError, prisma } from '../shared/prisma';
import { CrudProvider } from '../shared/types';

const { business } = prisma;

export type BusinessServiceProvider = CrudProvider<Business>;

const businessService: BusinessServiceProvider = {
  async create(businessData: Omit<Business, 'id'>) {
    return business.create({ data: businessData });
  },
  async delete(id: number) {
    try {
      await business.delete({ where: { id } });
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: number) {
    return await business.findUnique({ where: { id } }) || undefined;
  },
  async list(skip:number, take:number) {
    return business.findMany({ skip, take });
  },
  async update(businessData) {
    return business.update({ data: businessData, where: { id: businessData.id } });
  },
};

export default businessService;
