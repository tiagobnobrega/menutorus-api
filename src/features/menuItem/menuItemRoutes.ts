import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import httpError from '../shared/httpError';
import menuItemService, { RichMenuItem } from './menuItemService';

const basePath = '/menu-item';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await menuItemService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/section/{sectionId}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { sectionId } = req.params;
      const { skip, take } = req.query;
      const data = await menuItemService.listForMenuSection(Number.parseInt(sectionId, 10), skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await menuItemService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemService.update(req.payload as RichMenuItem);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuItemService.create(req.payload as RichMenuItem);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await menuItemService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
