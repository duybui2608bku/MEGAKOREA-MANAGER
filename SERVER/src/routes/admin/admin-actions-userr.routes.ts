import { Router } from 'express'
import { ADMIN_PATH_ROUTES } from '~/constants/path-routes/admin/admin.path-routes'
import {
  updateProfileByAdminController,
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,
  assignUserRoleController,
  assignUserDepartmentController,
  deleteUserController
} from '~/controllers/admin/admin.controller'
import { registerController } from '~/controllers/user/user.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  accessTokenValidator,
  registerValidator,
  updateProfileByAdminValidator
} from '~/middlewares/user/user.middleware'
import {
  updateUserStatusValidator,
  assignUserRoleValidator,
  assignUserDepartmentValidator
} from '~/middlewares/admin/admin.middleware'
import { isAdminValidator, isExistUserValidator } from '~/middlewares/utils/utils.middlewares'

const adminActionsUserRouters = Router()

adminActionsUserRouters.use(accessTokenValidator, isAdminValidator)

adminActionsUserRouters.post(ADMIN_PATH_ROUTES.REGISTER, registerValidator, wrapRequestHandler(registerController))

adminActionsUserRouters.get(ADMIN_PATH_ROUTES.GET_ALL_USERS, wrapRequestHandler(getAllUsersController))

adminActionsUserRouters.get(ADMIN_PATH_ROUTES.GET_USER_BY_ID, wrapRequestHandler(getUserByIdController))

adminActionsUserRouters.patch(
  ADMIN_PATH_ROUTES.UPDATE_PROFILE_BY_ADMIN,
  isExistUserValidator,
  updateProfileByAdminValidator,
  wrapRequestHandler(updateProfileByAdminController)
)

adminActionsUserRouters.patch(
  ADMIN_PATH_ROUTES.UPDATE_USER_STATUS,
  updateUserStatusValidator,
  wrapRequestHandler(updateUserStatusController)
)

adminActionsUserRouters.patch(
  ADMIN_PATH_ROUTES.ASSIGN_USER_ROLE,
  assignUserRoleValidator,
  wrapRequestHandler(assignUserRoleController)
)

adminActionsUserRouters.patch(
  ADMIN_PATH_ROUTES.ASSIGN_USER_DEPARTMENT,
  assignUserDepartmentValidator,
  wrapRequestHandler(assignUserDepartmentController)
)

adminActionsUserRouters.delete(ADMIN_PATH_ROUTES.DELETE_USER, wrapRequestHandler(deleteUserController))

export default adminActionsUserRouters
