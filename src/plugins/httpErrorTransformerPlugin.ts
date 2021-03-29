import { Plugin, Server } from '@hapi/hapi';
import { Boom } from '@hapi/boom';
import httpError from 'src/features/shared/httpError';

const httpErrorTransformerPlugin : Plugin<undefined> = {
  name: 'httpErrorTransformer',
  version: '1.0.0',
  async register(server:Server) {
    server.ext('onPreResponse', (request, h) => {
      const { response } = request;
      if (!(response as Boom).isBoom) {
        return h.continue;
      }
      const error = response;
      // console.log('@@@@@@@@@@@onPreResponse ERROR:', { error });
      return httpError((error as Boom)).err();
    });
  },
};

export default httpErrorTransformerPlugin;
