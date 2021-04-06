import { ServerRoute } from '@hapi/hapi';
import businessRoutes from './features/business/businessRoutes';
import menuRoutes from './features/menu/menuRoutes';
import menuSectionRoutes from './features/menuSection/menuSectionRoutes';

const routes: ServerRoute[] = [...businessRoutes, ...menuRoutes, ...menuSectionRoutes];

export default routes;
