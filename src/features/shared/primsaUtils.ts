import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import httpError from 'src/features/shared/httpError';

export default function convertPrismaError(error:Error):Error {
  if (error instanceof PrismaClientValidationError) {
    // TODO: This could be improved in future versions of prisma client: https://github.com/prisma/prisma/issues/5040
    return httpError('Primsa error, id probably not found.', error).status(400).err();
  } if (error instanceof PrismaClientKnownRequestError) {
    return httpError('Primsa error, probably constraint violation. Was it a delete attempt ?', error).status(400).err();
  }
  return error;
}
