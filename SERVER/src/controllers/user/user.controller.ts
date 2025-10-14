import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { userMessages } from '~/constants/messages/user/user.messages'
import {
  LoginRequestBody,
  RegisterRequestBody,
  ChangePasswordRequestBody,
  UpdateMyProfileRequestBody,
  RefreshTokenRequestBody,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  VerifyEmailRequestBody,
  VerifyOtpRequestBody
} from '~/interfaces/user/users.interface'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import usersService from '~/services/user/user.service'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  await usersService.register(req.body)
  ResponseSuccess({
    message: userMessages.REGISTER_SUCCESS,
    res
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const result = await usersService.login(req.body)
  ResponseSuccess({
    message: userMessages.LOGIN_SUCCESS,
    res,
    result
  })
}

export const getProfileController = async (req: Request, res: Response) => {
  const user_id = req.decode_authorization?.user_id as string
  const result = await usersService.getUserProfile(user_id)
  ResponseSuccess({
    message: userMessages.GET_PROFILE_SUCCESS,
    res,
    result
  })
}

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateMyProfileRequestBody>,
  res: Response
) => {
  const user_id = req.decode_authorization?.user_id as string
  const result = await usersService.updateProfile(user_id, req.body)
  ResponseSuccess({
    message: userMessages.UPDATE_PROFILE_SUCCESS,
    res,
    result
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response
) => {
  const user_id = req.decode_authorization?.user_id as string
  const result = await usersService.changePassword(user_id, req.body)
  ResponseSuccess({
    message: userMessages.CHANGE_PASSWORD_SUCCESS,
    res,
    result
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response
) => {
  const result = await usersService.refreshToken(req.body)
  ResponseSuccess({
    message: userMessages.REFRESH_TOKEN_SUCCESS,
    res,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  await usersService.logout(user_id)
  ResponseSuccess({
    message: userMessages.LOGOUT_SUCCESS,
    res
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const result = await usersService.forgotPassword(req.body)
  ResponseSuccess({
    message: userMessages.FORGOT_PASSWORD_SUCCESS,
    res,
    result
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response
) => {
  await usersService.resetPassword(req.body)
  ResponseSuccess({
    message: userMessages.RESET_PASSWORD_SUCCESS,
    res
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response
) => {
  await usersService.verifyEmail(req.body)
  ResponseSuccess({
    message: userMessages.VERIFY_EMAIL_SUCCESS,
    res
  })
}

export const verifyOtpController = async (req: Request<ParamsDictionary, any, VerifyOtpRequestBody>, res: Response) => {
  const result = await usersService.verifyOtp(req.body)
  ResponseSuccess({
    message: userMessages.VERIFY_OTP_SUCCESS,
    res,
    result
  })
}
