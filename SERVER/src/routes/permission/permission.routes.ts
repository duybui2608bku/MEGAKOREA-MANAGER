import { Router } from 'express'
import {
  createPermissionController,
  getPermissionsController,
  getPermissionByIdController,
  updatePermissionController,
  deletePermissionController
} from '~/controllers/permission/permission.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import { createPermissionValidator, updatePermissionValidator } from '~/middlewares/permission/permission.middleware'
import { isAdminValidator } from '~/middlewares/utils/utils.middlewares'
import { PERMISSION_PATH_ROUTES } from '~/constants/path-routes/permission/permission.path-routes'

const permissionRouters = Router()
permissionRouters.use(accessTokenValidator, isAdminValidator)

permissionRouters.post(
  PERMISSION_PATH_ROUTES.CREATE,
  createPermissionValidator,
  wrapRequestHandler(createPermissionController)
)
permissionRouters.get(PERMISSION_PATH_ROUTES.GET_ALL, wrapRequestHandler(getPermissionsController))
permissionRouters.get(`${PERMISSION_PATH_ROUTES.GET_BY_ID}/:id`, wrapRequestHandler(getPermissionByIdController))
permissionRouters.put(
  `${PERMISSION_PATH_ROUTES.UPDATE}/:id`,
  updatePermissionValidator,
  wrapRequestHandler(updatePermissionController)
)
permissionRouters.delete(`${PERMISSION_PATH_ROUTES.DELETE}/:id`, wrapRequestHandler(deletePermissionController))

export default permissionRouters
