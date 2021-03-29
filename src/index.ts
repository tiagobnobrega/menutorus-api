import * as Hapi from '@hapi/hapi';
import httpErrorTransformerPlugin from './plugins/httpErrorTransformerPlugin';
import config from './config/config';
import routes from './routes';

const init = async ():Promise<void> => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: { origin: config.corsOrigins, credentials: true },
    },
  });

  // ==== PLUGINS ====
  await server.register([{
    plugin: httpErrorTransformerPlugin,
    // options: {},
  }]);

  // ==== ROUTES =====
  server.realm.modifiers.route.prefix = '/api';
  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init().catch((error) => console.error('Unexpected error on startup', error));
