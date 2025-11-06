import { FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES } from '~/constants/path-routes/workspace/facebookads/page.path-routes'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController
} from '~/controllers/workspace/facebookads/page.controller'
import {
  createPostValidator,
  updatePostValidator,
  getAllPostsValidator,
  postIdParamValidator
} from '~/middlewares/workspace/facebookads/tools/page/page.middleware'

import { paginationQueryValidator } from '~/middlewares/utils/utils.middlewares'
import { Router } from 'express'

const facebookadsToolsPageRoutes = Router()

facebookadsToolsPageRoutes.post(
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.CREATE_POST,
  createPostValidator,
  wrapRequestHandler(createPostController)
)

facebookadsToolsPageRoutes.get(
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.GET_ALL_POSTS,
  paginationQueryValidator,
  getAllPostsValidator,
  wrapRequestHandler(getAllPostsController)
)

facebookadsToolsPageRoutes.get(
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.GET_POST_BY_ID,
  postIdParamValidator,
  wrapRequestHandler(getPostByIdController)
)

facebookadsToolsPageRoutes.put(
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.UPDATE_POST,
  postIdParamValidator,
  updatePostValidator,
  wrapRequestHandler(updatePostController)
)

facebookadsToolsPageRoutes.delete(
  FACEBOOKADS_TOOLS_PAGE_PATH_ROUTES.DELETE_POST,
  postIdParamValidator,
  wrapRequestHandler(deletePostController)
)

export default facebookadsToolsPageRoutes
