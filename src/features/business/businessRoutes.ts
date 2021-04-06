import {
  ResponseObject, ResponseToolkit, ServerRoute, Request,
} from '@hapi/hapi';
import { Business } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import httpError from '../shared/httpError';
import businessService from './businessService';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/business',
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await businessService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: '/business/{id}',
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await businessService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: '/business',
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await businessService.update(req.payload as Business);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: '/business',
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await businessService.create(req.payload as Business);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: '/business/{id}',
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await businessService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
