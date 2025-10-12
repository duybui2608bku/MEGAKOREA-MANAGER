import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { ErrorWithStatusCode } from './error-response.middleware'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatusCode) {
    return res.status(err.statusCode).json(omit(err, 'statusCode'))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HttpStatusCode.InternalServerError).json({
    message: err.message,
    infoError: omit(err, 'stack')
  })
}
