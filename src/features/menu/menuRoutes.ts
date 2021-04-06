import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import httpError from '../shared/httpError';
import menuService, { RichMenu } from './menuService';

const basePath = '/menu';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await menuService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await menuService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuService.update(req.payload as RichMenu);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuService.create(req.payload as RichMenu);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await menuService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
