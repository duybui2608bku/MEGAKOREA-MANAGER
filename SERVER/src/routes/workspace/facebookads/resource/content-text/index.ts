import { Router } from 'express'
import { FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES } from '~/constants/path-routes/workspace/facebookads/content-text.path-routes'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  createContentTextController,
  getAllContentTextsController,
  getContentTextByIdController,
  updateContentTextController,
  deleteContentTextController
} from '~/controllers/workspace/facebookads/content-text.controller'
import {
  createContentTextValidator,
  updateContentTextValidator,
  getAllContentTextsValidator,
  contentTextIdParamValidator
} from '~/middlewares/workspace/facebookads/resource/content-text/content-text.middleware'
import { paginationQueryValidator } from '~/middlewares/utils/utils.middlewares'

const contentTextRoutes = Router()

contentTextRoutes.post(
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.CREATE_CONTENT_TEXT,
  createContentTextValidator,
  wrapRequestHandler(createContentTextController)
)

contentTextRoutes.get(
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.GET_ALL_CONTENT_TEXTS,
  paginationQueryValidator,
  getAllContentTextsValidator,
  wrapRequestHandler(getAllContentTextsController)
)

contentTextRoutes.get(
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.GET_CONTENT_TEXT_BY_ID,
  contentTextIdParamValidator,
  wrapRequestHandler(getContentTextByIdController)
)

contentTextRoutes.put(
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.UPDATE_CONTENT_TEXT,
  contentTextIdParamValidator,
  updateContentTextValidator,
  wrapRequestHandler(updateContentTextController)
)

contentTextRoutes.delete(
  FACEBOOKADS_RESOURCE_CONTENT_TEXT_PATH_ROUTES.DELETE_CONTENT_TEXT,
  contentTextIdParamValidator,
  wrapRequestHandler(deleteContentTextController)
)

export default contentTextRoutes
