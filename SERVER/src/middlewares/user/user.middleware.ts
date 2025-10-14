import { checkSchema } from 'express-validator'
import { validate } from '../handler/validation.middlewares'
import { userMessages } from '~/constants/messages/user/user.messages'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { ErrorWithStatusCode } from '../error/error-response.middleware'
import usersService from '~/services/user/user.service'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { verifyToken } from '~/jwt/jwt'

import { config } from 'dotenv'
config()

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: userMessages.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistsEmail = await usersService.checkEmail(value)
            if (isExistsEmail) {
              throw new ErrorWithStatusCode({
                message: userMessages.EMAIL_EXISTS,
                statusCode: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      name: {
        notEmpty: {
          errorMessage: userMessages.NAME_REQUIRED
        },
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.NAME_LENGTH
        },
        trim: true
      },
      phone: {
        notEmpty: {
          errorMessage: userMessages.PHONE_REQUIRED
        },
        isMobilePhone: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistsPhone = await usersService.checkPhone(value)
            if (isExistsPhone) {
              throw new ErrorWithStatusCode({
                message: userMessages.PHONE_EXISTS,
                statusCode: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: userMessages.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        }
      },
      derpartment: {
        optional: true,
        isString: {
          errorMessage: userMessages.DERPARTMENT_MUST_BE_STRING
        },
        trim: true
      },
      titles: {
        optional: true,
        isInt: {
          errorMessage: userMessages.TITLES_MUST_BE_INT
        },
        toInt: true
      },
      gender: {
        optional: true,
        isInt: {
          errorMessage: userMessages.GENDER_INVALID
        },
        toInt: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          errorMessage: userMessages.DATE_OF_BIRTH_INVALID
        },
        toDate: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: userMessages.ADDRESS_MUST_BE_STRING
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: userMessages.AVATAR_MUST_BE_STRING
        },
        trim: true
      },
      roles: {
        isArray: {
          errorMessage: userMessages.ROLES_MUST_BE_ARRAY
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: userMessages.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: userMessages.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        notEmpty: {
          errorMessage: userMessages.OLD_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.OLD_PASSWORD_MUST_BE_STRING
        },
        trim: true
      },
      new_password: {
        notEmpty: {
          errorMessage: userMessages.NEW_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: userMessages.CONFIRM_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRING
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new ErrorWithStatusCode({
                message: userMessages.PASSWORDS_NOT_MATCH,
                statusCode: HttpStatusCode.BadRequest
              })
            }
            return value
          }
        }
      }
    },
    ['body']
  )
)

export const updateMyProfileValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.NAME_LENGTH
        },
        trim: true
      },
      phone: {
        optional: true,
        isString: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        isMobilePhone: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        trim: true
      },
      gender: {
        optional: true,
        isInt: {
          options: {
            min: 1,
            max: 3
          },
          errorMessage: userMessages.GENDER_INVALID
        },
        toInt: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          errorMessage: userMessages.DATE_OF_BIRTH_INVALID
        },
        toDate: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: userMessages.ADDRESS_MUST_BE_STRING
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: userMessages.AVATAR_MUST_BE_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)

export const updateProfileByAdminValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.NAME_LENGTH
        },
        trim: true
      },
      phone: {
        optional: true,
        isString: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        isMobilePhone: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        trim: true
      },
      gender: {
        optional: true,
        isInt: {
          options: {
            min: 1,
            max: 3
          },
          errorMessage: userMessages.GENDER_INVALID
        },
        toInt: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          errorMessage: userMessages.DATE_OF_BIRTH_INVALID
        },
        toDate: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: userMessages.ADDRESS_MUST_BE_STRING
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: userMessages.AVATAR_MUST_BE_STRING
        },
        trim: true
      },
      derpartment: {
        optional: true,
        isString: {
          errorMessage: userMessages.DERPARTMENT_MUST_BE_STRING
        },
        trim: true
      },
      titles: {
        optional: true,
        isInt: {
          errorMessage: userMessages.TITLES_MUST_BE_INT
        },
        toInt: true
      },
      status: {
        optional: true,
        isInt: {
          errorMessage: userMessages.STATUS_INVALID
        },
        toInt: true
      },
      password: {
        notEmpty: {
          errorMessage: userMessages.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatusCode({
                message: userMessages.ACCESS_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESSTOKEN as string
              })
              req.decode_authorization = decode_authorization
              const { user_id } = decode_authorization
              const user = await usersService.getUserById(user_id)
              if (user) {
                req.user = user
              }
            } catch (error) {
              throw new ErrorWithStatusCode({
                message: capitalize((error as JsonWebTokenError).message),
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: userMessages.REFRESH_TOKEN_REQUIRED
        },
        isString: {
          errorMessage: userMessages.REFRESH_TOKEN_INVALID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatusCode({
                message: userMessages.REFRESH_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decoded_refresh_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESHTOKEN as string
              })
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              throw new ErrorWithStatusCode({
                message: capitalize((error as JsonWebTokenError).message),
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: userMessages.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage: 'Reset token is required'
        },
        isString: {
          errorMessage: 'Reset token must be a string'
        },
        trim: true
      },
      new_password: {
        notEmpty: {
          errorMessage: userMessages.NEW_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.NEW_PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: userMessages.CONFIRM_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRING
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new ErrorWithStatusCode({
                message: userMessages.PASSWORDS_NOT_MATCH,
                statusCode: HttpStatusCode.BadRequest
              })
            }
            return value
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: userMessages.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true
      },
      verification_code: {
        notEmpty: {
          errorMessage: 'Verification code is required'
        },
        isString: {
          errorMessage: 'Verification code must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 6
          },
          errorMessage: 'Verification code must be 6 characters'
        }
      }
    },
    ['body']
  )
)

export const verifyOtpValidator = validate(
  checkSchema(
    {
      phone: {
        notEmpty: {
          errorMessage: userMessages.PHONE_REQUIRED
        },
        isMobilePhone: {
          errorMessage: userMessages.PHONE_MUST_BE_STRING
        },
        trim: true
      },
      otp_code: {
        notEmpty: {
          errorMessage: 'OTP code is required'
        },
        isString: {
          errorMessage: 'OTP code must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 6
          },
          errorMessage: 'OTP code must be 6 characters'
        }
      }
    },
    ['body']
  )
)
