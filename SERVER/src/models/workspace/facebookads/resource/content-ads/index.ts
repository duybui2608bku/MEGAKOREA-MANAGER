import mongoose from 'mongoose'
import { WORKSPACE_COLLECTION_NAME } from '~/constants/collecttions/name.collecttions'

const ContentTextSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  branch: {
    type: String
  },
  services: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model(WORKSPACE_COLLECTION_NAME.facebookAds.content_ads as string, ContentTextSchema)
