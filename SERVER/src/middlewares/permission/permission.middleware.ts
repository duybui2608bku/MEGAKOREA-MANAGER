import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'

export const createPermissionValidator = validate(
  checkSchema(
    {
      code: {
        notEmpty: {
          errorMessage: 'Permission code is required'
        },
        isString: {
          errorMessage: 'Permission code must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission code must be between 1 and 100 characters'
        },
        trim: true
      },
      name: {
        notEmpty: {
          errorMessage: 'Permission name is required'
        },
        isString: {
          errorMessage: 'Permission name must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: 'Permission name must be between 1 and 255 characters'
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: 'Permission description must be a string'
        },
        trim: true
      },
      module: {
        notEmpty: {
          errorMessage: 'Permission module is required'
        },
        isString: {
          errorMessage: 'Permission module must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission module must be between 1 and 100 characters'
        },
        trim: true
      },
      action: {
        notEmpty: {
          errorMessage: 'Permission action is required'
        },
        isString: {
          errorMessage: 'Permission action must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission action must be between 1 and 100 characters'
        },
        trim: true
      }
    },
    ['body']
  )
)

export const updatePermissionValidator = validate(
  checkSchema(
    {
      code: {
        optional: true,
        isString: {
          errorMessage: 'Permission code must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission code must be between 1 and 100 characters'
        },
        trim: true
      },
      name: {
        optional: true,
        isString: {
          errorMessage: 'Permission name must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: 'Permission name must be between 1 and 255 characters'
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: 'Permission description must be a string'
        },
        trim: true
      },
      module: {
        optional: true,
        isString: {
          errorMessage: 'Permission module must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission module must be between 1 and 100 characters'
        },
        trim: true
      },
      action: {
        optional: true,
        isString: {
          errorMessage: 'Permission action must be a string'
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Permission action must be between 1 and 100 characters'
        },
        trim: true
      }
    },
    ['body']
  )
)
