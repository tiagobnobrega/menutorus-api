import * as Hapi from '@hapi/hapi';
import httpErrorTransformerPlugin from './plugins/httpErrorTransformerPlugin';
import config from './config/config';
import routes from './routes';
import { prismaPlugin } from './features/shared/prisma';
import { registerAuthStrategy } from './features/security/authStrategy';

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
  }, { plugin: prismaPlugin }]);

  // ==== AUTH ====
  await registerAuthStrategy(server);

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

// === Handle process stop properly ===
process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', () => {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});
// === ===
init().catch((error) => {
  console.error('Unexpected error on startup', error);
  process.kill(process.pid, 'SIGINT');
});
