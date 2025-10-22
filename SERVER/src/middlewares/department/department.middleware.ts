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
      },
      code: {
        optional: true,
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.CODE_MUST_BE_STRING
        },
        trim: true
      },
      assigned_menus: {
        optional: true,
        isArray: {
          errorMessage: DEPARTMENT_MESSAGES.ASSIGNED_MENUS_MUST_BE_AN_ARRAY
        }
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
      },
      // status: {
      //   optional: true,
      //   toInt: true,
      //   isIn: {
      //     options: [1, 0],
      //     errorMessage: DEPARTMENT_MESSAGES.STATUS_INVALID_VALUE
      //   }
      // },
      code: {
        optional: true,
        isString: {
          errorMessage: DEPARTMENT_MESSAGES.CODE_MUST_BE_STRING
        },
        trim: true
      },
      assigned_menus: {
        optional: true,
        isArray: {
          errorMessage: DEPARTMENT_MESSAGES.ASSIGNED_MENUS_MUST_BE_AN_ARRAY
        }
      }
    },
    ['body']
  )
)

export const getDepartmentByIdValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: DEPARTMENT_MESSAGES.ID_REQUIRED
        }
      }
    },
    ['params']
  )
)

export const deleteDepartmentValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: DEPARTMENT_MESSAGES.ID_REQUIRED
        }
      }
    },
    ['params']
  )
)
