import { Router } from 'express'
import {
  FACEBOOKADS_PATH_ROUTES,
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES,
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES
} from './path'
import facebookadsToolsPageRoutes from './tools/page'
import contentTextRoutes from './resource/content-text'

const facebookadsRoutes = Router()

facebookadsRoutes.use(
  `${FACEBOOKADS_PATH_ROUTES.TOOLS_PATH}${FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.ROOT}`,
  facebookadsToolsPageRoutes
)

facebookadsRoutes.use(
  `${FACEBOOKADS_PATH_ROUTES.RESOURCE_PATH}${FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.ROOT}`,
  contentTextRoutes
)

export default facebookadsRoutes
