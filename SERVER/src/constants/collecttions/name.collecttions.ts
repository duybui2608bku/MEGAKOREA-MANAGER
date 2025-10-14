import { config } from 'dotenv'
config()

const COLLECTION_NAME = {
  USER: process.env.USER_COLLECTION_NAME,
  DERPARTMENT: process.env.DERPARTMENT_COLLECTION_NAME,
  PERMISSION: process.env.PERMISSION_COLLECTION_NAME,
  ROLE: process.env.ROLE_COLLECTION_NAME,
  MENU: process.env.MENU_COLLECTION_NAME
}

export default COLLECTION_NAME
