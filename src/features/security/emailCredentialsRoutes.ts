import * as Jwt from '@hapi/jwt';
import {
  Request, ResponseObject, ResponseToolkit, ServerRoute,
} from '@hapi/hapi';
import userService from 'src/features/security/userService';
import httpError from 'src/features/shared/httpError';
import tokenService from 'src/features/security/tokenService';
import config from 'src/config/config';
import securityUtils from './securityUtils';

const basePath = '/login/user-id';

interface UserIdLoginData {
  userId: string;
  password: string;
}

const routes: ServerRoute[] = [
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: false,
    },
    handler: async (req:Request, h:ResponseToolkit): Promise<ResponseObject> => {
      const payload = req.payload as UserIdLoginData;
      if (!payload?.userId) throw httpError('Authentication not provided').status(401).err();
      const { userId, password } = payload;
      const getMethod = userId.includes('@') ? 'getForEmail' : 'get';
      const user = await userService[getMethod](userId, true);
      if (config.nodeEnv === 'development' && !user) {
        throw httpError('User not found').status(403).err();
      }
      if ((!user || !await securityUtils.compare(password, user.pwd))) throw httpError('Invalid username or password').status(403).err();
      const token = await tokenService.create({ owner: user.username, tokenType: 'DEFAULT' });
      const jwtToken = securityUtils.generateToken(tokenService.toJwt(token));
      return h.response({ token: jwtToken }).code(201).header('Authorization', jwtToken);
    },
  },
];

export default routes;
