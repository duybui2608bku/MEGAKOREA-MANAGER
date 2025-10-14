import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { DEPARTMENT_MESSAGES } from '~/constants/messages/derpartment/derpartment.message'

export const createDepartmentValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: DEPARTMENT_MESSAGES.NAME_REQUIRED
        },
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: DEPARTMENT_MESSAGES.NAME_LENGTH
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)

export const updateDepartmentValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: DEPARTMENT_MESSAGES.NAME_LENGTH
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)
