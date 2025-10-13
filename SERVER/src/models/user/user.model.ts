import mongoose from 'mongoose'
import COLLECTION_NAME from '~/constants/collecttions/name.collecttions'
import { UserGender, UserRole, UserStatus, UserTitles } from '~/constants/enum/user/user.enum'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: Number,
      enum: UserGender,
      required: true
    },
    avatar: {
      type: String
    },
    date_of_birth: {
      type: Date
    },
    address: {
      type: String
    },
    status: {
      type: Number,
      enum: UserStatus,
      default: UserStatus.WORKING
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.ROLE,
        required: true
      }
    ],
    derpartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.DERPARTMENT,
      default: null
    },
    titles: {
      type: Number,
      enum: UserTitles,
      default: UserTitles.OTHER
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
  { collection: COLLECTION_NAME.USER }
)

const User = mongoose.model(COLLECTION_NAME.USER as string, userSchema)
export default User
