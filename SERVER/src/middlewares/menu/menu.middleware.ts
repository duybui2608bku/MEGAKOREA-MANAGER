import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { MENU_MESSAGES } from '~/constants/messages/menu/menu.message'

export const createMenuValidator = validate(
  checkSchema(
    {
      path: {
        notEmpty: {
          errorMessage: MENU_MESSAGES.MENU_PATH_REQUIRED
        },
        isString: {
          errorMessage: MENU_MESSAGES.MENU_PATH_MUST_BE_A_STRING
        },
        trim: true
      },
      component: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_COMPONENT_MUST_BE_A_STRING
        },
        trim: true
      },
      name: {
        notEmpty: {
          errorMessage: MENU_MESSAGES.MENU_NAME_REQUIRED
        },
        isString: {
          errorMessage: MENU_MESSAGES.MENU_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: MENU_MESSAGES.MENU_NAME_MUST_BE_BETWEEN_1_AND_100_CHARACTERS
        },
        trim: true
      },
      icon: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_ICON_MUST_BE_A_STRING
        },
        trim: true
      },
      order: {
        optional: true,
        isInt: {
          errorMessage: MENU_MESSAGES.MENU_ORDER_MUST_BE_AN_INTEGER
        },
        toInt: true
      },
      parentId: {
        optional: true,
        isMongoId: {
          errorMessage: MENU_MESSAGES.PARENT_ID_MUST_BE_A_VALID_MONGODB_OBJECT_ID
        }
      },
      roles: {
        optional: true,
        isArray: {
          errorMessage: MENU_MESSAGES.MENU_ROLES_MUST_BE_AN_ARRAY
        }
      },
      'roles.*': {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_EACH_ROLE_MUST_BE_A_STRING
        }
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: MENU_MESSAGES.MENU_PERMISSIONS_MUST_BE_AN_ARRAY
        }
      },
      'permissions.*': {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_EACH_PERMISSION_MUST_BE_A_STRING
        }
      },
      status: {
        optional: true,
        isInt: {
          options: {
            min: 0,
            max: 1
          },
          errorMessage: MENU_MESSAGES.MENU_STATUS_MUST_BE_0_OR_1
        },
        toInt: true
      },
      keepAlive: {
        optional: true,
        isBoolean: {
          errorMessage: MENU_MESSAGES.MENU_KEEP_ALIVE_MUST_BE_A_BOOLEAN
        },
        toBoolean: true
      },
      hidden: {
        optional: true,
        isBoolean: {
          errorMessage: MENU_MESSAGES.MENU_HIDDEN_MUST_BE_A_BOOLEAN
        },
        toBoolean: true
      }
    },
    ['body']
  )
)

export const updateMenuValidator = validate(
  checkSchema(
    {
      path: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_PATH_MUST_BE_A_STRING
        },
        trim: true
      },
      component: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_COMPONENT_MUST_BE_A_STRING
        },
        trim: true
      },
      name: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: MENU_MESSAGES.MENU_NAME_MUST_BE_BETWEEN_1_AND_100_CHARACTERS
        },
        trim: true
      },
      title: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_TITLE_MUST_BE_A_STRING
        },
        trim: true
      },
      icon: {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_ICON_MUST_BE_A_STRING
        },
        trim: true
      },
      order: {
        optional: true,
        isInt: {
          errorMessage: MENU_MESSAGES.MENU_ORDER_MUST_BE_AN_INTEGER
        },
        toInt: true
      },
      parentId: {
        optional: true,
        isMongoId: {
          errorMessage: MENU_MESSAGES.PARENT_ID_MUST_BE_A_VALID_MONGODB_OBJECT_ID
        }
      },
      roles: {
        optional: true,
        isArray: {
          errorMessage: MENU_MESSAGES.MENU_ROLES_MUST_BE_AN_ARRAY
        }
      },
      'roles.*': {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_EACH_ROLE_MUST_BE_A_STRING
        }
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: MENU_MESSAGES.MENU_PERMISSIONS_MUST_BE_AN_ARRAY
        }
      },
      'permissions.*': {
        optional: true,
        isString: {
          errorMessage: MENU_MESSAGES.MENU_EACH_PERMISSION_MUST_BE_A_STRING
        }
      },
      status: {
        optional: true,
        isInt: {
          options: {
            min: 0,
            max: 1
          },
          errorMessage: MENU_MESSAGES.MENU_STATUS_MUST_BE_0_OR_1
        },
        toInt: true
      },
      keepAlive: {
        optional: true,
        isBoolean: {
          errorMessage: MENU_MESSAGES.MENU_KEEP_ALIVE_MUST_BE_A_BOOLEAN
        },
        toBoolean: true
      },
      hidden: {
        optional: true,
        isBoolean: {
          errorMessage: MENU_MESSAGES.MENU_HIDDEN_MUST_BE_A_BOOLEAN
        },
        toBoolean: true
      }
    },
    ['body']
  )
)
