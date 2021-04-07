import { ServerRoute } from '@hapi/hapi';
import businessRoutes from './features/business/businessRoutes';
import menuRoutes from './features/menu/menuRoutes';
import menuSectionRoutes from './features/menuSection/menuSectionRoutes';
import menuItemRoutes from './features/menuItem/menuItemRoutes';
import menuItemMediaRoutes from './features/menuItemMedia/menuItemMediaRoutes';

const routes: ServerRoute[] = [...businessRoutes, ...menuRoutes, ...menuSectionRoutes, ...menuItemRoutes, ...menuItemMediaRoutes];

export default routes;
