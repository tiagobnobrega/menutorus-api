import { ServerRoute } from '@hapi/hapi';
import securityRoutes from 'src/features/security/securityRoutes';
import businessRoutes from './features/business/businessRoutes';
import menuRoutes from './features/menu/menuRoutes';
import menuSectionRoutes from './features/menuSection/menuSectionRoutes';
import menuItemRoutes from './features/menuItem/menuItemRoutes';
import menuItemMediaRoutes from './features/menuItemMedia/menuItemMediaRoutes';
import menuItemIconRoutes from './features/menuItemIcon/menuItemIconRoutes';
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Auth post https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-auth-mngp1ps7kip4
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const routes: ServerRoute[] = [
  ...businessRoutes,
  ...menuRoutes,
  ...menuSectionRoutes,
  ...menuItemRoutes,
  ...menuItemMediaRoutes,
  ...menuItemIconRoutes,
  ...securityRoutes,
];

export default routes;
