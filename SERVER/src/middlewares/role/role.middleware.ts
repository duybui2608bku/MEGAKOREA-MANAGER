import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { ROLE_MESSAGES } from '~/constants/messages/roles/role.messagge'

export const createRoleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
        },
        isString: {
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
        },
        trim: true
      },
      code: {
        notEmpty: {
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
        },
        isString: {
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED
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
      permissionIds: {
        optional: true,
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSION_IDS_MUST_BE_ARRAY
        }
      },
      'permissionIds.*': {
        optional: true,
        isMongoId: {
          errorMessage: ROLE_MESSAGES.EACH_PERMISSION_ID_MUST_BE_VALID_MONGODB_OBJECT_ID
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
      permissionIds: {
        optional: true,
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSION_IDS_MUST_BE_ARRAY
        }
      },
      'permissionIds.*': {
        optional: true,
        isMongoId: {
          errorMessage: ROLE_MESSAGES.EACH_PERMISSION_ID_MUST_BE_VALID_MONGODB_OBJECT_ID
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
      permissionIds: {
        isArray: {
          errorMessage: ROLE_MESSAGES.PERMISSION_IDS_MUST_BE_ARRAY
        },
        notEmpty: {
          errorMessage: ROLE_MESSAGES.AT_LEAST_ONE_PERMISSION_ID_IS_REQUIRED
        }
      },
      'permissionIds.*': {
        isMongoId: {
          errorMessage: ROLE_MESSAGES.EACH_PERMISSION_ID_MUST_BE_VALID_MONGODB_OBJECT_ID
        }
      }
    },
    ['body']
  )
)
