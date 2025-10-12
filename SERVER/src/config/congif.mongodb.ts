'use strict'

import { config } from 'dotenv'

config()

const nameENV = {
  development: 'development',
  production: 'production'
}

const development = {
  app: {
    port: process.env.DEV_APP_PORT
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME
  },
  name: nameENV.development
}

const production = {
  app: {
    port: process.env.PRO_APP_PORT
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME
  },
  name: nameENV.production
}

const configMongodb = { development, production }

const env = process.env.NODE_ENV || nameENV.development

export default configMongodb[env as keyof typeof configMongodb]
