import { checkSchema } from 'express-validator'
import { PAGE_MESSAGES } from '~/constants/messages/workspace/facebookads/page.messages'
import { validate } from '~/middlewares/handler/validation.middlewares'

export const createPostValidator = validate(
  checkSchema(
    {
      url: {
        notEmpty: {
          errorMessage: PAGE_MESSAGES.POST_URL_REQUIRED
        },
        isString: {
          errorMessage: PAGE_MESSAGES.POST_URL_INVALID
        },
        isURL: {
          errorMessage: PAGE_MESSAGES.POST_URL_INVALID
        },
        trim: true
      },
      page_name: {
        notEmpty: {
          errorMessage: PAGE_MESSAGES.PAGE_NAME_REQUIRED
        },
        isString: true,
        trim: true
      },
      page_id: {
        notEmpty: {
          errorMessage: PAGE_MESSAGES.PAGE_ID_REQUIRED
        },
        isString: true,
        trim: true
      },
      services: {
        notEmpty: {
          errorMessage: PAGE_MESSAGES.SERVICES_REQUIRED
        },
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const updatePostValidator = validate(
  checkSchema(
    {
      url: {
        optional: true,
        isString: {
          errorMessage: PAGE_MESSAGES.POST_URL_INVALID
        },
        trim: true
      },
      page_name: {
        optional: true,
        isString: true,
        trim: true
      },
      page_id: {
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

export const getAllPostsValidator = validate(
  checkSchema(
    {
      search: {
        optional: true,
        isString: true,
        trim: true
      },
      page_name: {
        optional: true,
        isString: true,
        trim: true
      },
      page_id: {
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
          errorMessage: PAGE_MESSAGES.INVALID_DATE_RANGE
        }
      },
      end_date: {
        optional: true,
        isISO8601: {
          errorMessage: PAGE_MESSAGES.INVALID_DATE_RANGE
        }
      }
    },
    ['query']
  )
)

export const postIdParamValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: PAGE_MESSAGES.POST_NOT_FOUND
        },
        isMongoId: {
          errorMessage: PAGE_MESSAGES.POST_NOT_FOUND
        }
      }
    },
    ['params']
  )
)
