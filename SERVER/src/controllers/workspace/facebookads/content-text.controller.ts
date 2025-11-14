import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CONTENT_TEXT_MESSAGES } from '~/constants/messages/workspace/facebookads/content-text.messages'
import {
  CreateContentTextRequestBody,
  UpdateContentTextRequestBody,
  GetAllContentTextsQuery
} from '~/interfaces/workspace/facebookads/content-text.interface'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import contentTextService from '~/services/workspace/facebookads/content-text.service'

export const createContentTextController = async (
  req: Request<ParamsDictionary, any, CreateContentTextRequestBody>,
  res: Response
) => {
  const result = await contentTextService.createContentText(req.body)
  ResponseSuccess({
    message: CONTENT_TEXT_MESSAGES.CREATE_CONTENT_TEXT_SUCCESS,
    res,
    result
  })
}

export const getAllContentTextsController = async (req: Request, res: Response) => {
  const query = req.query as GetAllContentTextsQuery
  const result = await contentTextService.getAllContentTexts(query)
  ResponseSuccess({
    message: CONTENT_TEXT_MESSAGES.GET_CONTENT_TEXTS_SUCCESS,
    res,
    result
  })
}

export const getContentTextByIdController = async (req: Request, res: Response) => {
  const result = await contentTextService.getContentTextById(req.params.id)
  ResponseSuccess({
    message: CONTENT_TEXT_MESSAGES.GET_CONTENT_TEXT_DETAIL_SUCCESS,
    res,
    result
  })
}

export const updateContentTextController = async (
  req: Request<ParamsDictionary, any, UpdateContentTextRequestBody>,
  res: Response
) => {
  const result = await contentTextService.updateContentText(req.params.id, req.body)
  ResponseSuccess({
    message: CONTENT_TEXT_MESSAGES.UPDATE_CONTENT_TEXT_SUCCESS,
    res,
    result
  })
}

export const deleteContentTextController = async (req: Request, res: Response) => {
  await contentTextService.deleteContentText(req.params.id)
  ResponseSuccess({
    message: CONTENT_TEXT_MESSAGES.DELETE_CONTENT_TEXT_SUCCESS,
    res
  })
}

