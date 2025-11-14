import { checkSchema } from 'express-validator'
import { validate } from '~/middlewares/handler/validation.middlewares'
import { LEAVE_REQUEST_MESSAGES } from '~/constants/messages/leave/leave.messages'
import { DurationType, LeaveType } from '~/constants/enum/leave/leave.enum'

/**
 * Validator cho tạo đơn nghỉ phép
 */
export const createLeaveRequestValidator = validate(
  checkSchema(
    {
      leave_type: {
        in: ['body'],
        notEmpty: {
          errorMessage: LEAVE_REQUEST_MESSAGES.LEAVE_TYPE_REQUIRED
        },
        isIn: {
          options: [Object.values(LeaveType)],
          errorMessage: LEAVE_REQUEST_MESSAGES.LEAVE_TYPE_INVALID
        }
      },
      duration_type: {
        in: ['body'],
        notEmpty: {
          errorMessage: LEAVE_REQUEST_MESSAGES.DURATION_TYPE_REQUIRED
        },
        isIn: {
          options: [Object.values(DurationType)],
          errorMessage: LEAVE_REQUEST_MESSAGES.DURATION_TYPE_INVALID
        }
      },
      start_date: {
        in: ['body'],
        notEmpty: {
          errorMessage: LEAVE_REQUEST_MESSAGES.START_DATE_REQUIRED
        },
        isISO8601: {
          options: { strict: true },
          errorMessage: LEAVE_REQUEST_MESSAGES.START_DATE_INVALID
        }
      },
      end_date: {
        in: ['body'],
        optional: true,
        isISO8601: {
          options: { strict: true },
          errorMessage: LEAVE_REQUEST_MESSAGES.END_DATE_INVALID
        }
      },
      reason: {
        in: ['body'],
        notEmpty: {
          errorMessage: LEAVE_REQUEST_MESSAGES.REASON_REQUIRED
        },
        isString: true,
        trim: true,
        isLength: {
          options: {
            min: 10
          },
          errorMessage: LEAVE_REQUEST_MESSAGES.REASON_TOO_SHORT
        }
      }
    },
    ['body']
  )
)

/**
 * Validator cho duyệt đơn nghỉ phép
 */
export const approveLeaveRequestValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'ID không hợp lệ'
        }
      },
      approval_note: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['params', 'body']
  )
)

/**
 * Validator cho từ chối đơn nghỉ phép
 */
export const rejectLeaveRequestValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'ID không hợp lệ'
        }
      },
      rejection_reason: {
        in: ['body'],
        notEmpty: {
          errorMessage: LEAVE_REQUEST_MESSAGES.REJECTION_REASON_REQUIRED
        },
        isString: true,
        trim: true,
        isLength: {
          options: {
            min: 10
          },
          errorMessage: LEAVE_REQUEST_MESSAGES.REJECTION_REASON_TOO_SHORT
        }
      }
    },
    ['params', 'body']
  )
)

/**
 * Validator cho hủy đơn nghỉ phép
 */
export const cancelLeaveRequestValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'ID không hợp lệ'
        }
      }
    },
    ['params']
  )
)

/**
 * Validator cho lấy chi tiết đơn nghỉ phép
 */
export const getLeaveRequestByIdValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'ID không hợp lệ'
        }
      }
    },
    ['params']
  )
)
