import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { ErrorWithStatusCode } from './error-response.middleware'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatusCode) {
    return res.status(err.statusCode).json(omit(err, 'statusCode'))
  }

  // Extract only safe properties to avoid circular reference errors
  const safeError: any = {
    message: err.message || 'Internal Server Error',
    name: err.name || 'Error'
  }

  // Add error code if available
  if (err.code) {
    safeError.code = err.code
  }

  // Add AWS-specific error info if available
  if (err.$metadata) {
    safeError.awsError = {
      httpStatusCode: err.$metadata.httpStatusCode,
      requestId: err.$metadata.requestId
    }
  }

  res.status(HttpStatusCode.InternalServerError).json(safeError)
}
