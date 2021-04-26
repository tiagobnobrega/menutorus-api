import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import httpError from 'src/features/shared/httpError';
import { PrismaClient } from '@prisma/client';
import Hapi from '@hapi/hapi';

export function convertPrismaError(error:Error):Error {
  if (error instanceof PrismaClientValidationError) {
    // TODO: This could be improved in future versions of prisma client: https://github.com/prisma/prisma/issues/5040
    return httpError('Prisma error, id probably not found.', error).status(400).err();
  } if (error instanceof PrismaClientKnownRequestError) {
    return httpError('Prisma error, probably constraint violation. Was it a delete attempt ?', error).status(400).err();
  }
  return error;
}
export const prisma = new PrismaClient();

// plugin to instantiate Prisma Client
export const prismaPlugin: Hapi.Plugin<null> = {
  name: 'prisma',
  async register(server: Hapi.Server) {
    // eslint-disable-next-line no-param-reassign
    server.app.prisma = prisma;
    // Close DB connection after the server's connection listeners are stopped
    // Related issue: https://github.com/hapijs/hapi/issues/2839
    server.ext({
      type: 'onPostStop',
      method: async (hapiServer: Hapi.Server) => {
        hapiServer.app.prisma.$disconnect();
      },
    });
  },
};
