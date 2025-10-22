import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { ROLE_MESSAGES } from '~/constants/messages/roles/role.messagge'

export const createRoleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ROLE_MESSAGES.NAME_REQUIRED
        },
        isString: {
          errorMessage: ROLE_MESSAGES.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: ROLE_MESSAGES.NAME_MUST_BE_BETWEEN_1_AND_255_CHARACTERS
        },
        trim: true
      },
      code: {
        notEmpty: {
          errorMessage: ROLE_MESSAGES.CODE_REQUIRED
        },
        isString: {
          errorMessage: ROLE_MESSAGES.CODE_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: ROLE_MESSAGES.CODE_MUST_BE_BETWEEN_1_AND_100_CHARACTERS
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: ROLE_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSIONS_MUST_BE_AN_ARRAY
        }
      }
    },
    ['body']
  )
)

export const updateRoleValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: ROLE_MESSAGES.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: ROLE_MESSAGES.NAME_MUST_BE_BETWEEN_1_AND_255_CHARACTERS
        },
        trim: true
      },
      code: {
        optional: true,
        isString: {
          errorMessage: ROLE_MESSAGES.CODE_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: ROLE_MESSAGES.CODE_MUST_BE_BETWEEN_1_AND_100_CHARACTERS
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: ROLE_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSION_IDS_MUST_BE_ARRAY
        }
      },
      status: {
        optional: true,
        isInt: {
          options: {
            min: 1,
            max: 2
          },
          errorMessage: ROLE_MESSAGES.STATUS_MUST_BE_1_OR_2
        },
        toInt: true
      }
    },
    ['body']
  )
)

export const assignPermissionsValidator = validate(
  checkSchema(
    {
      permissions: {
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSIONS_MUST_BE_AN_ARRAY
        },
        notEmpty: {
          errorMessage: ROLE_MESSAGES.AT_LEAST_ONE_PERMISSION_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)
