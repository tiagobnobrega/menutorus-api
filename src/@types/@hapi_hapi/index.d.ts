// eslint-disable-next-line unicorn/filename-case
import { User, PrismaClient } from '@prisma/client';
// eslint-disable-next-line unicorn/filename-case
declare module '@hapi/hapi' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface UserCredentials extends User{}
  export interface ServerApplicationState {
    prisma: PrismaClient
  }
}
