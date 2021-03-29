import { Business, PrismaClient } from '@prisma/client';
import { CrudProvider } from '../shared/types';

const prisma = new PrismaClient();
const { business } = prisma;

export type BusinessServiceProvider = CrudProvider<Business>;

const businessService: BusinessServiceProvider = {
  async create(businessData: Omit<Business, 'id'>) {
    return business.create({ data: businessData });
  },
  async delete(id: number) {
    await business.delete({ where: { id } });
  },
  async get(id: number) {
    return business.findUnique({ where: { id } });
  },
  async list(skip:number, take:number) {
    return business.findMany({ skip, take });
  },
  async update(businessData) {
    return business.update({ data: businessData, where: { id: businessData.id } });
  },
};

export default businessService;
