import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatusCode {
  message: string
  statusCode: number
  constructor({ message, statusCode }: { message: string; statusCode: number }) {
    this.message = message
    this.statusCode = statusCode
  }
}

export class EntityError extends ErrorWithStatusCode {
  errors: ErrorType
  constructor({ errors, message = userMessages.VALIDATION_ERROR }: { errors: ErrorType; message?: string }) {
    super({ message, statusCode: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
