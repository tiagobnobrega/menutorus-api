import cfg from './cfg';

interface AppConfig {
  dbUrl: string;
  dbDialect: string;
}

const appConfig: AppConfig = {
  dbUrl: cfg('DB_URL').required().string(),
  dbDialect: cfg('DB_DIALECT').required().string(),
};

export default appConfig;
