import { TokenType, UserRole } from '~/constants/enum/user/user.enum'
import { signToken } from '~/jwt/jwt'

import { config } from 'dotenv'
import { hashPassword } from '~/jwt/crypro'
import {
  LoginRequestBody,
  RegisterRequestBody,
  ChangePasswordRequestBody,
  UpdateMyProfileRequestBody
} from '~/interfaces/user/users.interface'
import userRepository from '~/repository/user/user.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { userMessages } from '~/constants/messages/user/user.messages'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import _ from 'lodash'
config()

const algorithm = 'HS256'

class UsersService {
  private signAccessToken(user_id: string, role: UserRole) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, role },
      priveKey: process.env.JWT_SECRET_ACCESSTOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any, algorithm }
    })
  }

  private signRefreshToken(user_id: string, role: UserRole) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, role },
      priveKey: process.env.JWT_SECRET_REFRESHTOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any, algorithm }
    })
  }

  async register(user: RegisterRequestBody) {
    const { password, ...rest } = user
    const hashedPassword = hashPassword(password)
    const newUser = await userRepository.createUser({ ...rest, password: hashedPassword })

    const user_id = newUser._id.toString()
    const role = newUser.role

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id, role),
      this.signRefreshToken(user_id, role)
    ])

    return { access_token, refresh_token }
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
    const user = await userRepository.getUserById(user_id)
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
    return user
  }

  async login(loginData: LoginRequestBody) {
    const { email, password } = loginData

    const User = await userRepository.checkUserByEmailAndPassword(email, password)

    if (!User) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(User._id.toString(), User.role),
      this.signRefreshToken(User._id.toString(), User.role)
    ])

    return { access_token, refresh_token, user: User }
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
}

const usersService = new UsersService()

export default usersService
