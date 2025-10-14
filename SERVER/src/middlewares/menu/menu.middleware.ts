import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'

export const createMenuValidator = validate(
  checkSchema(
    {
      path: {
        notEmpty: {
          errorMessage: 'Menu path is required'
        },
        isString: {
          errorMessage: 'Menu path must be a string'
        },
        trim: true
      },
      component: {
        optional: true,
        isString: {
          errorMessage: 'Menu component must be a string'
        },
        trim: true
      },
      name: {
        notEmpty: {
          errorMessage: 'Menu name is required'
        },
        isString: {
          errorMessage: 'Menu name must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Menu name must be between 1 and 100 characters'
        },
        trim: true
      },
      title: {
        notEmpty: {
          errorMessage: 'Menu title is required'
        },
        isString: {
          errorMessage: 'Menu title must be a string'
        },
        trim: true
      },
      icon: {
        optional: true,
        isString: {
          errorMessage: 'Menu icon must be a string'
        },
        trim: true
      },
      order: {
        optional: true,
        isInt: {
          errorMessage: 'Menu order must be an integer'
        },
        toInt: true
      },
      parentId: {
        optional: true,
        isMongoId: {
          errorMessage: 'Parent ID must be a valid MongoDB ObjectId'
        }
      },
      roles: {
        optional: true,
        isArray: {
          errorMessage: 'Roles must be an array'
        }
      },
      'roles.*': {
        optional: true,
        isString: {
          errorMessage: 'Each role must be a string'
        }
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: 'Permissions must be an array'
        }
      },
      'permissions.*': {
        optional: true,
        isString: {
          errorMessage: 'Each permission must be a string'
        }
      },
      status: {
        optional: true,
        isInt: {
          options: {
            min: 0,
            max: 1
          },
          errorMessage: 'Status must be 0 (inactive) or 1 (active)'
        },
        toInt: true
      },
      isExternal: {
        optional: true,
        isBoolean: {
          errorMessage: 'isExternal must be a boolean'
        },
        toBoolean: true
      },
      externalLink: {
        optional: true,
        isString: {
          errorMessage: 'External link must be a string'
        },
        trim: true
      },
      iframeLink: {
        optional: true,
        isString: {
          errorMessage: 'Iframe link must be a string'
        },
        trim: true
      },
      keepAlive: {
        optional: true,
        isBoolean: {
          errorMessage: 'keepAlive must be a boolean'
        },
        toBoolean: true
      },
      hidden: {
        optional: true,
        isBoolean: {
          errorMessage: 'hidden must be a boolean'
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
          errorMessage: 'Menu path must be a string'
        },
        trim: true
      },
      component: {
        optional: true,
        isString: {
          errorMessage: 'Menu component must be a string'
        },
        trim: true
      },
      name: {
        optional: true,
        isString: {
          errorMessage: 'Menu name must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Menu name must be between 1 and 100 characters'
        },
        trim: true
      },
      title: {
        optional: true,
        isString: {
          errorMessage: 'Menu title must be a string'
        },
        trim: true
      },
      icon: {
        optional: true,
        isString: {
          errorMessage: 'Menu icon must be a string'
        },
        trim: true
      },
      order: {
        optional: true,
        isInt: {
          errorMessage: 'Menu order must be an integer'
        },
        toInt: true
      },
      parentId: {
        optional: true,
        isMongoId: {
          errorMessage: 'Parent ID must be a valid MongoDB ObjectId'
        }
      },
      roles: {
        optional: true,
        isArray: {
          errorMessage: 'Roles must be an array'
        }
      },
      'roles.*': {
        optional: true,
        isString: {
          errorMessage: 'Each role must be a string'
        }
      },
      permissions: {
        optional: true,
        isArray: {
          errorMessage: 'Permissions must be an array'
        }
      },
      'permissions.*': {
        optional: true,
        isString: {
          errorMessage: 'Each permission must be a string'
        }
      },
      status: {
        optional: true,
        isInt: {
          options: {
            min: 0,
            max: 1
          },
          errorMessage: 'Status must be 0 (inactive) or 1 (active)'
        },
        toInt: true
      },
      isExternal: {
        optional: true,
        isBoolean: {
          errorMessage: 'isExternal must be a boolean'
        },
        toBoolean: true
      },
      externalLink: {
        optional: true,
        isString: {
          errorMessage: 'External link must be a string'
        },
        trim: true
      },
      iframeLink: {
        optional: true,
        isString: {
          errorMessage: 'Iframe link must be a string'
        },
        trim: true
      },
      keepAlive: {
        optional: true,
        isBoolean: {
          errorMessage: 'keepAlive must be a boolean'
        },
        toBoolean: true
      },
      hidden: {
        optional: true,
        isBoolean: {
          errorMessage: 'hidden must be a boolean'
        },
        toBoolean: true
      }
    },
    ['body']
  )
)
