import { config } from 'dotenv'
config()
export const ENV_CONFIG = {
  REDIS_URL: process.env.REDIS_URL as string,
  REDIS_TTL: process.env.REDIS_TTL as string,
  CROS_URL: process.env.CORS_URL as string,
  MODE: process.env.NODE_ENV as string,
  DEV_APP_PORT: process.env.DEV_APP_PORT as string,
  DEV_DB_HOST: process.env.DEV_DB_HOST as string,
  DEV_DB_PORT: process.env.DEV_DB_PORT as string,
  DEV_DB_NAME: process.env.DEV_DB_NAME as string,
  PRO_APP_PORT: process.env.PRO_APP_PORT as string,
  PRO_DB_HOST: process.env.PRO_DB_HOST as string,
  PRO_DB_PORT: process.env.PRO_DB_PORT as string,
  PRO_DB_NAME: process.env.PRO_DB_NAME as string
}
