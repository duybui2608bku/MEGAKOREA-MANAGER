import mongoose from 'mongoose'
import { WORKSPACE_COLLECTION_NAME } from '~/constants/collecttions/name.collecttions'

const postedOfPageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  page_name: {
    type: String
  },
  page_id: {
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

export default mongoose.model(WORKSPACE_COLLECTION_NAME.facebookAds.posted_of_pages as string, postedOfPageSchema)
