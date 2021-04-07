import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import { MenuItemMedia } from '@prisma/client';
import httpError from '../shared/httpError';
import menuItemMediaService from './menuItemMediaService';

const basePath = '/menu-item-media';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await menuItemMediaService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await menuItemMediaService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemMediaService.update(req.payload as MenuItemMedia);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemMediaService.create(req.payload as MenuItemMedia);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await menuItemMediaService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
