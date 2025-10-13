import mongoose from 'mongoose'
import COLLECTION_NAME from '~/constants/collecttions/name.collecttions'

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.PERMISSION
      }
    ],
    status: {
      type: Number,
      enum: [1, 2],
      default: 1
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
  { collection: COLLECTION_NAME.ROLE }
)

console.log(COLLECTION_NAME.ROLE)

const Role = mongoose.model(COLLECTION_NAME.ROLE as string, roleSchema)
export default Role
