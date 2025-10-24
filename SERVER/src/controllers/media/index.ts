import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import PATH_UPLOAD from '~/services/media/dir'
import { MEDIA_MESSAGES } from '~/constants/messages/media'
import { ResponseError, ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import mediasService from '~/services/media'

export const uploadleImageController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadImage(req)
  ResponseSuccess({
    res,
    message: MEDIA_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result
  })
}

export const uploadleVideoController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadVideo(req)
  ResponseSuccess({
    res,
    message: MEDIA_MESSAGES.UPLOAD_VIDEO_SUCCESS,
    result
  })
}

export const uploadleDocumentController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadDocument(req)
  ResponseSuccess({
    res,
    message: MEDIA_MESSAGES.UPLOAD_DOCUMENT_SUCCESS,
    result
  })
}

export const serverImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  const filePath = path.resolve(PATH_UPLOAD.UPLOAD_IMAGE_DIR, name)

  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    if (accessErr) {
      return ResponseError({
        res,
        message: MEDIA_MESSAGES.FILE_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        if (!res.headersSent) {
          return ResponseError({
            res,
            message: MEDIA_MESSAGES.ERROR_SENDING_FILE,
            statusCode: HttpStatusCode.BadRequest
          })
        }
      }
    })
  })
}
