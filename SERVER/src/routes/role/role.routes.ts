import { Router } from 'express'
import {
  createRoleController,
  getRolesController,
  getRoleByIdController,
  updateRoleController,
  deleteRoleController
  // assignPermissionsToRoleController
} from '~/controllers/role/role.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import {
  createRoleValidator,
  updateRoleValidator
  // assignPermissionsValidator
} from '~/middlewares/role/role.middleware'
import { isAdminValidator } from '~/middlewares/utils/utils.middlewares'
import { ROLE_PATH_ROUTES } from '~/constants/path-routes/roles/roles.path-routes'

const roleRouters = Router()

roleRouters.use(accessTokenValidator, isAdminValidator)

roleRouters.post(ROLE_PATH_ROUTES.CREATE, createRoleValidator, wrapRequestHandler(createRoleController))

roleRouters.get(ROLE_PATH_ROUTES.GET_ALL, wrapRequestHandler(getRolesController))

roleRouters.get(`${ROLE_PATH_ROUTES.GET_BY_ID}/:id`, wrapRequestHandler(getRoleByIdController))

roleRouters.put(`${ROLE_PATH_ROUTES.UPDATE}/:id`, updateRoleValidator, wrapRequestHandler(updateRoleController))

roleRouters.delete(`${ROLE_PATH_ROUTES.DELETE}/:id`, wrapRequestHandler(deleteRoleController))

// roleRouters.patch(
//   `${ROLE_PATH_ROUTES.ASSIGN_PERMISSIONS}/:id`,
//   assignPermissionsValidator,
//   wrapRequestHandler(assignPermissionsToRoleController)
// )

export default roleRouters
