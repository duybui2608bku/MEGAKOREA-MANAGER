import mongoose from 'mongoose'
import COLLECTION_NAME from '~/constants/collecttions/name.collecttions'
import { MenuStatus } from '~/constants/enum/menu'

const menuSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      index: true
    },
    component: {
      type: String
    },
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    order: {
      type: Number,
      default: 0
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.MENU,
      default: null
    },
    roles: [
      {
        type: String
      }
    ],
    permissions: [
      {
        type: String
      }
    ],
    status: {
      type: Number,
      enum: MenuStatus,
      default: 1
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
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
  { collection: COLLECTION_NAME.MENU }
)

const Menu = mongoose.model(COLLECTION_NAME.MENU as string, menuSchema)
export default Menu
