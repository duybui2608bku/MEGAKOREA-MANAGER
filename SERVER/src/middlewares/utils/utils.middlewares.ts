import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { UserRole, UserStatus } from '~/constants/enum/user/user.enum'
import { userMessages } from '~/constants/messages/user/user.messages'
import { ErrorWithStatusCode } from '../error/error-response.middleware'
import { adminMessages } from '~/constants/messages/admin/admin.messages'

const adminRolesId = '68eb6a1bd651578e103a1c20'

export const isAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user) {
    throw new ErrorWithStatusCode({
      message: userMessages.USER_NOT_FOUND,
      statusCode: HttpStatusCode.Unauthorized
    })
  }

  if (!user.roles.includes(adminRolesId)) {
    throw new ErrorWithStatusCode({
      message: adminMessages.ACCESS_DENIED,
      statusCode: HttpStatusCode.Forbidden
    })
  }

  if (user.status !== UserStatus.WORKING && user.status !== UserStatus.PROBATION) {
    throw new ErrorWithStatusCode({
      message: adminMessages.ACCOUNT_INACTIVE,
      statusCode: HttpStatusCode.Forbidden
    })
  }
  next()
}

export const isExistUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    throw new ErrorWithStatusCode({
      message: userMessages.USER_NOT_FOUND,
      statusCode: HttpStatusCode.NotFound
    })
  }
  next()
}
