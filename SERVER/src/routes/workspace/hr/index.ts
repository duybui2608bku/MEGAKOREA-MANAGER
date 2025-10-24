import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import { HR_PATH_ROUTES } from './path'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { getAllEmployeesController } from '~/controllers/workspace/hr'
import { paginationQueryValidator } from '~/middlewares/utils/utils.middlewares'
import { getAllEmployeesQueryValidator } from '~/middlewares/workspace/hr'

const hrRoutes = Router()

hrRoutes.use(accessTokenValidator)

hrRoutes.get(
  HR_PATH_ROUTES.GET_ALL_EMPLOYEES,
  paginationQueryValidator,
  getAllEmployeesQueryValidator,
  wrapRequestHandler(getAllEmployeesController)
)

export default hrRoutes
