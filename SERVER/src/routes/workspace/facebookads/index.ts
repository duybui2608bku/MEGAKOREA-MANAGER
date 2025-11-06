import { Router } from 'express'
import { FACEBOOKADS_PATH_ROUTES, FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES } from './path'
import facebookadsToolsPageRoutes from './tools/page'

const facebookadsRoutes = Router()

facebookadsRoutes.use(
  `${FACEBOOKADS_PATH_ROUTES.TOOLS_PATH}${FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.ROOT}`,
  facebookadsToolsPageRoutes
)

export default facebookadsRoutes
