import { Router } from 'express'
import { ADMIN_PATH_ROUTES } from '~/constants/path-routes/admin/admin.path-routes'
import { updateProfileByAdminController } from '~/controllers/admin/admin.controller'
import { registerController } from '~/controllers/user/user.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  accessTokenValidator,
  registerValidator,
  updateProfileByAdminValidator
} from '~/middlewares/user/user.middleware'
import { isAdminValidator, isExistUserValidator } from '~/middlewares/utils/utils.middlewares'

const adminActionsUserRouters = Router()

adminActionsUserRouters.use(accessTokenValidator, isAdminValidator)

adminActionsUserRouters.post(ADMIN_PATH_ROUTES.REGISTER, registerValidator, wrapRequestHandler(registerController))

adminActionsUserRouters.patch(
  ADMIN_PATH_ROUTES.UPDATE_PROFILE_BY_ADMIN,
  isExistUserValidator,
  updateProfileByAdminValidator,
  wrapRequestHandler(updateProfileByAdminController)
)

export default adminActionsUserRouters
