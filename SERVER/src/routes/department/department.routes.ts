import { Router } from 'express'
import {
  createDepartmentController,
  getDepartmentsController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController
} from '~/controllers/department/department.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import { createDepartmentValidator, updateDepartmentValidator } from '~/middlewares/department/department.middleware'
import { isAdminValidator } from '~/middlewares/utils/utils.middlewares'
import { DEPARTMENT_PATH_ROUTES } from '~/constants/path-routes/derpartment/derpartment.path-routes'

const departmentRouters = Router()

departmentRouters.use(accessTokenValidator, isAdminValidator)

departmentRouters.post(
  DEPARTMENT_PATH_ROUTES.CREATE,
  createDepartmentValidator,
  wrapRequestHandler(createDepartmentController)
)
departmentRouters.get(DEPARTMENT_PATH_ROUTES.GET_ALL, wrapRequestHandler(getDepartmentsController))

departmentRouters.get(`${DEPARTMENT_PATH_ROUTES.GET_BY_ID}/:id`, wrapRequestHandler(getDepartmentByIdController))

departmentRouters.put(
  DEPARTMENT_PATH_ROUTES.UPDATE,
  updateDepartmentValidator,
  wrapRequestHandler(updateDepartmentController)
)
departmentRouters.delete(`${DEPARTMENT_PATH_ROUTES.DELETE}/:id`, wrapRequestHandler(deleteDepartmentController))

export default departmentRouters
