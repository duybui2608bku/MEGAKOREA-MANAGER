import mongoose from 'mongoose'
import COLLECTION_NAME from '~/constants/collecttions/name.collecttions'

const derpartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: Number,
      default: 1
    },
    description: {
      type: String
    },
    assigned_menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.MENU
      }
    ],
    code: {
      type: String,
      unique: true,
      index: true
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
  { collection: COLLECTION_NAME.DERPARTMENT }
)

const Derpartment = mongoose.model(COLLECTION_NAME.DERPARTMENT as string, derpartmentSchema)
export default Derpartment
