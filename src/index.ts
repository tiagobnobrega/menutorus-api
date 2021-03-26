import * as Hapi from '@hapi/hapi';
import config from './config/config';

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: { origin: config.corsOrigins, credentials: true },
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
  console.log({ config });
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
