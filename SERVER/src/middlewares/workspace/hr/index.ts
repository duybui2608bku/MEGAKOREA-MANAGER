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

export const updateEmployeeProfileValidator = validate(
  checkSchema(
    {
      _id: {
        notEmpty: {
          errorMessage: HR_MESSAGES.EMPLOYEE_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: HR_MESSAGES.EMPLOYEE_ID_MUST_BE_A_STRING
        },
        trim: true
      },
      name: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      phone: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.PHONE_MUST_BE_A_STRING
        },
        trim: true
      },
      gender: {
        optional: true,
        isNumeric: {
          errorMessage: HR_MESSAGES.GENDER_MUST_BE_A_NUMBER
        }
      },
      address: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.ADDRESS_MUST_BE_A_STRING
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: HR_MESSAGES.AVATAR_MUST_BE_A_STRING
        },
        trim: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          errorMessage: HR_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
        }
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
        isArray: {
          errorMessage: HR_MESSAGES.ROLES_MUST_BE_AN_ARRAY
        }
      }
    },
    ['body']
  )
)
