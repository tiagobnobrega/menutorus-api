import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import httpError from '../shared/httpError';
import menuSectionService, { RichMenuSection } from './menuSectionService';

const basePath = '/menu-section';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { skip, take } = req.query;
      const data = await menuSectionService.list(skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/menu/{menuId}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { menuId } = req.params;
      const { skip, take } = req.query;
      const data = await menuSectionService.listForMenu(Number.parseInt(menuId, 10), skip, take);
      return h.response(data);
    },
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const { id } = req.params;
      const data = await menuSectionService.get(Number.parseInt(id, 10));
      if (!data) throw httpError(`Business ${id} not found`).status(404).err();
      return h.response(data);
    },
  },
  {
    method: 'PUT',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuSectionService.update(req.payload as RichMenuSection);
      return h.response(data);
    },
  },
  {
    method: 'POST',
    path: basePath,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const data = await menuSectionService.create(req.payload as RichMenuSection);
      return h.response(data);
    },
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject|undefined> => {
      const { id } = req.params;
      await menuSectionService.delete(Number.parseInt(id, 10));
      return h.response().code(204);
    },
  },
];

export default routes;
