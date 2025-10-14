import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { userMessages } from '~/constants/messages/user/user.messages'

export const updateUserStatusValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: 'Status is required'
        },
        isInt: {
          options: {
            min: 1,
            max: 3
          },
          errorMessage: userMessages.STATUS_INVALID
        },
        toInt: true
      }
    },
    ['body']
  )
)

export const assignUserRoleValidator = validate(
  checkSchema(
    {
      roleIds: {
        isArray: {
          errorMessage: 'Role IDs must be an array'
        },
        notEmpty: {
          errorMessage: 'At least one role ID is required'
        }
      },
      'roleIds.*': {
        isMongoId: {
          errorMessage: 'Each role ID must be a valid MongoDB ObjectId'
        }
      }
    },
    ['body']
  )
)

export const assignUserDepartmentValidator = validate(
  checkSchema(
    {
      departmentId: {
        notEmpty: {
          errorMessage: 'Department ID is required'
        },
        isMongoId: {
          errorMessage: 'Department ID must be a valid MongoDB ObjectId'
        }
      }
    },
    ['body']
  )
)
