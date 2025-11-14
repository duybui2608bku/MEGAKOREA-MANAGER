import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import { WORKSPACE_HR_PATH_ROUTES } from './path'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  getAllEmployeesController,
  updateEmployeeProfileController,
  deleteEmployeeController
} from '~/controllers/workspace/hr'
import { paginationQueryValidator } from '~/middlewares/utils/utils.middlewares'
import { getAllEmployeesQueryValidator, updateEmployeeProfileValidator } from '~/middlewares/workspace/hr'

const hrRoutes = Router()

hrRoutes.use(accessTokenValidator)

hrRoutes.get(
  WORKSPACE_HR_PATH_ROUTES.GET_ALL_EMPLOYEES,
  paginationQueryValidator,
  getAllEmployeesQueryValidator,
  wrapRequestHandler(getAllEmployeesController)
)

hrRoutes.patch(
  WORKSPACE_HR_PATH_ROUTES.UPDATE_EMPLOYEE_PROFILE,
  updateEmployeeProfileValidator,
  wrapRequestHandler(updateEmployeeProfileController)
)

hrRoutes.delete(WORKSPACE_HR_PATH_ROUTES.DELETE_EMPLOYEE, wrapRequestHandler(deleteEmployeeController))

export default hrRoutes
