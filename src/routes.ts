import { ServerRoute } from '@hapi/hapi';
import businessRoutes from './features/business/businessRoutes';

const routes: ServerRoute[] = [...businessRoutes];

export default routes;
