import { checkSchema } from 'express-validator'
import { HR_MESSAGES } from '~/constants/messages/workspace/hr'
import { validate } from '~/middlewares/handler/validation.middlewares'

export const getAllEmployeesQueryValidator = validate(
  checkSchema(
    {
      search: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.SEARCH_MUST_BE_A_STRING
        },
        trim: true
      },
      department: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.DEPARTMENT_MUST_BE_A_STRING
        },
        trim: true
      },
      roles: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.ROLES_MUST_BE_A_STRING
        },
        trim: true
      },
      status: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.STATUS_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['query']
  )
)
