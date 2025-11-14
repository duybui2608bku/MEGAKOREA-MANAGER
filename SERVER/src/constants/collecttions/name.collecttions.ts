import { config } from 'dotenv'
config()

const COLLECTION_NAME = {
  USER: process.env.USER_COLLECTION_NAME,
  DERPARTMENT: process.env.DERPARTMENT_COLLECTION_NAME,
  PERMISSION: process.env.PERMISSION_COLLECTION_NAME,
  ROLE: process.env.ROLE_COLLECTION_NAME,
  MENU: process.env.MENU_COLLECTION_NAME,
  LEAVE_REQUEST: process.env.LEAVE_REQUEST_COLLECTION_NAME || 'leave_requests'
}

const WORKSPACE_COLLECTION_NAME = {
  facebookAds: {
    posted_of_pages: process.env.FACEBOOK_ADS_POSTED_OF_PAGES_COLLECTION_NAME,
    content_ads: process.env.FACEBOOK_ADS_CONTENT_TEXT_ADS_COLLECTION_NAME
  }
}

export { COLLECTION_NAME, WORKSPACE_COLLECTION_NAME }
