import mongoose from 'mongoose'
import COLLECTION_NAME from '~/constants/collecttions/name.collecttions'

const derpartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
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
