import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import { MenuItemIcon } from '@prisma/client';
import httpError from '../shared/httpError';
import menuItemIconService from './menuItemIconService';

const basePath = '/menu-item-icon';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await menuItemIconService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await menuItemIconService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemIconService.update(req.payload as MenuItemIcon);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemIconService.create(req.payload as MenuItemIcon);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await menuItemIconService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
