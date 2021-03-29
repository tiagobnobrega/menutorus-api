/**
 * App configuration class. Env files should be parsed using node cli "-r" option or docker env in production.
 */

import cfg from './cfg';

interface AppConfig {
  dbUrl: string;
  corsOrigins: string[];
  addErrorStack: boolean;
}

const appConfig: AppConfig = {
  dbUrl: cfg('DB_URL').required().string(),
  corsOrigins: cfg('CORS_ORIGINS', '*').string().split(','),
  addErrorStack: cfg('ADD_ERROR_STACK', 'false').boolean(),
};

export default appConfig;
