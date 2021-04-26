/**
 * App configuration class. Env files should be parsed using node cli "-r" option or docker env in production.
 */

import cfg from './cfg';

interface AppConfig {
  nodeEnv: string;
  dbUrl: string;
  corsOrigins: string[];
  addErrorStack: boolean;
  jwtSecret: string;
  jwtAlgorithm: string;
  tokenDuration:{
    EMAIL: number,
    DEFAULT: number,
    RESET: number,
  }
}

const appConfig: AppConfig = {
  dbUrl: cfg('DB_URL').required().string(),
  corsOrigins: cfg('CORS_ORIGINS', '*').string().split(','),
  addErrorStack: cfg('ADD_ERROR_STACK', 'false').boolean(),
  jwtSecret: cfg('JWT_SECRET', 'change_me').string(),
  jwtAlgorithm: cfg('JWT_ALGORITHM', 'HS256').string(),
  tokenDuration: {
    DEFAULT: cfg('TOKEN_DURATION_DEFAULT').int(7 * 24 * 1000 * 60 * 60),
    EMAIL: cfg('TOKEN_DURATION_EMAIL').int(12 * 1000 * 60 * 60),
    RESET: cfg('TOKEN_DURATION_EMAIL').int(2 * 1000 * 60 * 60),
  },
  nodeEnv: cfg('NODE_ENV').string('development'),
};

export default appConfig;
