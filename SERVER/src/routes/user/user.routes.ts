import { Router } from 'express'
import { USER_PATH_ROUTES } from '~/constants/path-routes/user/user.path-routes'

import {
  loginController,
  logoutController,
  getProfileController,
  updateMyProfileController,
  changePasswordController,
  refreshTokenController,
  forgotPasswordController
} from '~/controllers/user/user.controller'
import routeController from '~/controllers/route/route.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  loginValidator,
  accessTokenValidator,
  changePasswordValidator,
  updateMyProfileValidator,
  refreshTokenValidator,
  forgotPasswordValidator
} from '~/middlewares/user/user.middleware'
import { isExistUserValidator } from '~/middlewares/utils/utils.middlewares'

const userRouters = Router()

userRouters.post(USER_PATH_ROUTES.LOGIN, loginValidator, wrapRequestHandler(loginController))
userRouters.post(USER_PATH_ROUTES.LOGOUT, accessTokenValidator, wrapRequestHandler(logoutController))
userRouters.post(USER_PATH_ROUTES.REFRESH_TOKEN, refreshTokenValidator, wrapRequestHandler(refreshTokenController))

userRouters.post(
  USER_PATH_ROUTES.FORGOT_PASSWORD,
  forgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController)
)

userRouters.put(
  USER_PATH_ROUTES.CHANGE_PASSWORD,
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

userRouters.get(USER_PATH_ROUTES.PROFILE, accessTokenValidator, wrapRequestHandler(getProfileController))

userRouters.patch(
  USER_PATH_ROUTES.UPDATE_MY_PROFILE,
  accessTokenValidator,
  isExistUserValidator,
  updateMyProfileValidator,
  wrapRequestHandler(updateMyProfileController)
)

userRouters.get(
  USER_PATH_ROUTES.GET_ASYNC_ROUTES,
  accessTokenValidator,
  wrapRequestHandler(routeController.getAsyncRoutes)
)

export default userRouters
