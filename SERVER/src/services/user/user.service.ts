import { TokenType } from '~/constants/enum/user/user.enum'
import { signToken, verifyToken } from '~/jwt/jwt'

import { config } from 'dotenv'
import { hashPassword } from '~/jwt/crypro'
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
import userRepository from '~/repository/user/user.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { userMessages } from '~/constants/messages/user/user.messages'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import _ from 'lodash'
import { algorithm } from '~/constants/global/global.contants'
config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      priveKey: process.env.JWT_SECRET_ACCESSTOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any, algorithm }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      priveKey: process.env.JWT_SECRET_REFRESHTOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any, algorithm }
    })
  }

  private async checkUserExists(user_id: string) {
    const user = await userRepository.getUserById(user_id)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return user
  }

  async register(user: RegisterRequestBody) {
    const { password, ...rest } = user
    const hashedPassword = hashPassword(password)
    await userRepository.createUser({ ...rest, password: hashedPassword })
  }

  async checkPhone(phone: string) {
    const isExistsPhone = await userRepository.checkUserByPhone(phone)
    return isExistsPhone
  }

  async checkEmail(email: string) {
    const isExistsEmail = await userRepository.checkUserByEmail(email)
    return isExistsEmail
  }

  async getUserById(user_id: string) {
    const user = await this.checkUserExists(user_id)
    return user
  }

  async getUserProfile(user_id: string) {
    const user = await userRepository.getUserByIdWithoutPassword(user_id)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const userProfile = {
      ...user.toObject(),
      roles: [] as string[]
    }

    if (user.roles && user.roles.length > 0) {
      user.roles.forEach((role: any) => {
        if (role.code) {
          userProfile.roles.push(role.code)
        }
      })
    }

    return userProfile
  }

  async login(loginData: LoginRequestBody) {
    const { email, password } = loginData
    const user = await userRepository.checkUserByEmailAndPassword(email, password)

    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user._id.toString()),
      this.signRefreshToken(user._id.toString())
    ])

    return { access_token, refresh_token, user: user }
  }

  async changePassword(user_id: string, changePasswordData: ChangePasswordRequestBody) {
    const { old_password, new_password } = changePasswordData
    const user = await userRepository.getUserById(user_id)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const hashedOldPassword = hashPassword(old_password)
    if (user.password !== hashedOldPassword) {
      throw new ErrorWithStatusCode({
        message: userMessages.OLD_PASSWORD_INCORRECT,
        statusCode: HttpStatusCode.BadRequest
      })
    }
    const updatedUser = await userRepository.updateUserPassword(user_id, new_password)
    return updatedUser
  }

  async updateProfile(user_id: string, updateData: UpdateMyProfileRequestBody) {
    const user = await userRepository.getUserById(user_id)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    const forbiddenFields = ['email', 'phone', 'password', 'role', 'derpartment', 'titles', 'status']
    const newDataUpdate = _.omit(updateData, forbiddenFields)
    const updatedUser = await userRepository.updateUserProfile(user_id, newDataUpdate)
    return updatedUser
  }

  async refreshToken(refreshTokenData: RefreshTokenRequestBody) {
    const { refresh_token } = refreshTokenData

    const decoded_refresh_token = await verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESHTOKEN as string
    })

    if (decoded_refresh_token.token_type !== TokenType.RefreshToken) {
      throw new ErrorWithStatusCode({
        message: userMessages.REFRESH_TOKEN_INVALID,
        statusCode: HttpStatusCode.Unauthorized
      })
    }

    const user = await userRepository.getUserById(decoded_refresh_token.user_id)

    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(user._id.toString()),
      this.signRefreshToken(user._id.toString())
    ])

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async logout(user_id: string) {
    return null
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordRequestBody) {
    const { email } = forgotPasswordData
    const user = await userRepository.checkUserByEmail(email)

    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Generate reset token (in real implementation, you'd send this via email)
    const resetToken = signToken({
      payload: { user_id: (user as any)._id.toString(), token_type: TokenType.AccessToken },
      priveKey: process.env.JWT_SECRET_ACCESSTOKEN as string,
      options: { expiresIn: '15m', algorithm }
    })

    return {
      message: 'Password reset token generated',
      reset_token: resetToken // In production, this would be sent via email
    }
  }

  async resetPassword(resetPasswordData: ResetPasswordRequestBody) {
    const { token, new_password } = resetPasswordData

    const decoded_token = await verifyToken({
      token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESSTOKEN as string
    })

    const user = await userRepository.getUserById(decoded_token.user_id)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    await userRepository.updateUserPassword(decoded_token.user_id, new_password)
    return { message: 'Password reset successfully' }
  }

  async verifyEmail(verifyEmailData: VerifyEmailRequestBody) {
    const { email, verification_code } = verifyEmailData

    // In a real implementation, you'd verify the code against stored verification codes
    const user = await userRepository.checkUserByEmail(email)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Mock verification - in production, verify against stored codes
    if (verification_code !== '123456') {
      throw new ErrorWithStatusCode({
        message: 'Invalid verification code',
        statusCode: HttpStatusCode.BadRequest
      })
    }

    return { message: 'Email verified successfully' }
  }

  async verifyOtp(verifyOtpData: VerifyOtpRequestBody) {
    const { phone, otp_code } = verifyOtpData

    const user = await userRepository.checkUserByPhone(phone)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Mock OTP verification - in production, verify against stored OTP codes
    if (otp_code !== '123456') {
      throw new ErrorWithStatusCode({
        message: 'Invalid OTP code',
        statusCode: HttpStatusCode.BadRequest
      })
    }

    return {
      message: 'OTP verified successfully',
      verified: true
    }
  }
}

const usersService = new UsersService()

export default usersService
