import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'
import { ErrorWithStatusCode } from '../error/error-response.middleware'
import { adminMessages } from '~/constants/messages/admin/admin.messages'
import { validate } from '../handler/validation.middlewares'
import { checkSchema } from 'express-validator'
import { GLOBAL_MESSAGES } from '~/constants/messages/global/global.message'

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

export const paginationQueryValidator = validate(
  checkSchema(
    {
      current: {
        optional: true,
        isString: {
          errorMessage: GLOBAL_MESSAGES.CURRENT_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const current = parseInt(value)
            if (current < 1) {
              throw new ErrorWithStatusCode({
                message: GLOBAL_MESSAGES.CURRENT_MUST_BE_GREATER_THAN_0,
                statusCode: HttpStatusCode.BadRequest
              })
            }
          }
        }
      },
      pageSize: {
        optional: true,
        isString: {
          errorMessage: GLOBAL_MESSAGES.PAGE_SIZE_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const pageSize = parseInt(value)
            if (pageSize < 1 || pageSize > 100) {
              throw new ErrorWithStatusCode({
                message: GLOBAL_MESSAGES.PAGE_SIZE_MUST_BE_BETWEEN_1_AND_100,
                statusCode: HttpStatusCode.BadRequest
              })
            }
          }
        }
      }
    },
    ['query']
  )
)
