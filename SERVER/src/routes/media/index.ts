import { Router } from 'express'
import { MEDIA_PATH_ROUTES } from '~/constants/path-routes/media'
import { uploadleDocumentController, uploadleImageController, uploadleVideoController } from '~/controllers/media'

import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'

const mediaRouters = Router()

mediaRouters.post(MEDIA_PATH_ROUTES.UPLOAD_IMAGE, accessTokenValidator, wrapRequestHandler(uploadleImageController))
mediaRouters.post(MEDIA_PATH_ROUTES.UPLOAD_VIDEO, accessTokenValidator, wrapRequestHandler(uploadleVideoController))
mediaRouters.post(
  MEDIA_PATH_ROUTES.UPLOAD_DOCUMENT,
  accessTokenValidator,
  wrapRequestHandler(uploadleDocumentController)
)

export default mediaRouters
