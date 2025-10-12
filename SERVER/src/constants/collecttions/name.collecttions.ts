import { config } from 'dotenv'
config()

const COLLECTION_NAME = {
  USER: process.env.USER_COLLECTION_NAME,
  DERPARTMENT: process.env.DERPARTMENT_COLLECTION_NAME
}

export default COLLECTION_NAME
