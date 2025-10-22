import { Router } from 'express'
import {
  createMenuController,
  getMenusController,
  getMenuByIdController,
  updateMenuController,
  deleteMenuController,
  getMenusByDeptIdController
} from '~/controllers/menu/menu.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import { createMenuValidator, updateMenuValidator } from '~/middlewares/menu/menu.middleware'
import { isAdminValidator } from '~/middlewares/utils/utils.middlewares'
import { MENU_PATH_ROUTES } from '~/constants/path-routes/menu/menu.path-route'

const menuRouters = Router()
menuRouters.use(accessTokenValidator, isAdminValidator)

menuRouters.post(MENU_PATH_ROUTES.CREATE, createMenuValidator, wrapRequestHandler(createMenuController))
menuRouters.get(MENU_PATH_ROUTES.GET_ALL, wrapRequestHandler(getMenusController))
menuRouters.get(MENU_PATH_ROUTES.GET_BY_ID, wrapRequestHandler(getMenuByIdController))
menuRouters.get(MENU_PATH_ROUTES.GET_BY_DEPT_ID, wrapRequestHandler(getMenusByDeptIdController))
menuRouters.put(MENU_PATH_ROUTES.UPDATE, updateMenuValidator, wrapRequestHandler(updateMenuController))
menuRouters.delete(MENU_PATH_ROUTES.DELETE, wrapRequestHandler(deleteMenuController))

export default menuRouters
