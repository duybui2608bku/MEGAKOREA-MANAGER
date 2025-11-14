import { checkSchema } from 'express-validator'
import { CONTENT_TEXT_MESSAGES } from '~/constants/messages/workspace/facebookads/content-text.messages'
import { validate } from '~/middlewares/handler/validation.middlewares'

export const createContentTextValidator = validate(
  checkSchema(
    {
      content: {
        optional: true,
        notEmpty: {
          errorMessage: CONTENT_TEXT_MESSAGES.CONTENT_REQUIRED
        },
        isString: {
          errorMessage: CONTENT_TEXT_MESSAGES.CONTENT_INVALID
        },
        trim: true
      },
      category: {
        optional: true,
        notEmpty: {
          errorMessage: CONTENT_TEXT_MESSAGES.CATEGORY_REQUIRED
        },
        isString: true,
        trim: true
      },
      branch: {
        optional: true,
        notEmpty: {
          errorMessage: CONTENT_TEXT_MESSAGES.BRANCH_REQUIRED
        },
        isString: true,
        trim: true
      },
      services: {
        optional: true,
        notEmpty: {
          errorMessage: CONTENT_TEXT_MESSAGES.SERVICES_REQUIRED
        },
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const updateContentTextValidator = validate(
  checkSchema(
    {
      content: {
        optional: true,
        isString: {
          errorMessage: CONTENT_TEXT_MESSAGES.CONTENT_INVALID
        },
        trim: true
      },
      category: {
        optional: true,
        isString: true,
        trim: true
      },
      branch: {
        optional: true,
        isString: true,
        trim: true
      },
      services: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const getAllContentTextsValidator = validate(
  checkSchema(
    {
      search: {
        optional: true,
        isString: true,
        trim: true
      },
      category: {
        optional: true,
        isString: true,
        trim: true
      },
      branch: {
        optional: true,
        isString: true,
        trim: true
      },
      services: {
        optional: true,
        isString: true,
        trim: true
      },
      start_date: {
        optional: true,
        isISO8601: {
          errorMessage: CONTENT_TEXT_MESSAGES.INVALID_DATE_RANGE
        }
      },
      end_date: {
        optional: true,
        isISO8601: {
          errorMessage: CONTENT_TEXT_MESSAGES.INVALID_DATE_RANGE
        }
      }
    },
    ['query']
  )
)

export const contentTextIdParamValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: CONTENT_TEXT_MESSAGES.CONTENT_TEXT_NOT_FOUND
        },
        isMongoId: {
          errorMessage: CONTENT_TEXT_MESSAGES.CONTENT_TEXT_NOT_FOUND
        }
      }
    },
    ['params']
  )
)

