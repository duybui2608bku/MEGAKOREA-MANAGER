import { Router } from 'express'

import { USER_PATH_ROUTES } from '~/constants/path-routes/user/user.path-routes'
import {
  loginController,
  registerController,
  getProfileController,
  updateMyProfileController,
  changePasswordController
} from '~/controllers/user/user.controller'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  changePasswordValidator,
  updateMyProfileValidator
} from '~/middlewares/user/user.middleware'
import { isAdminValidator, isExistUserValidator } from '~/middlewares/utils/utils.middlewares'

const userRouters = Router()

userRouters.post(USER_PATH_ROUTES.LOGIN, loginValidator, wrapRequestHandler(loginController))

userRouters.get(USER_PATH_ROUTES.PROFILE, accessTokenValidator, wrapRequestHandler(getProfileController))

userRouters.patch(
  USER_PATH_ROUTES.UPDATE_MY_PROFILE,
  accessTokenValidator,
  isExistUserValidator,
  updateMyProfileValidator,
  wrapRequestHandler(updateMyProfileController)
)

userRouters.put(
  USER_PATH_ROUTES.CHANGE_PASSWORD,
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default userRouters
