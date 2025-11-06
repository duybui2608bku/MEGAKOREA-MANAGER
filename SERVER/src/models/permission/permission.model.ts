import mongoose from 'mongoose'
import { COLLECTION_NAME } from '~/constants/collecttions/name.collecttions'

const permissionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    module: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  { collection: COLLECTION_NAME.PERMISSION }
)

const Permission = mongoose.model(COLLECTION_NAME.PERMISSION as string, permissionSchema)
export default Permission
