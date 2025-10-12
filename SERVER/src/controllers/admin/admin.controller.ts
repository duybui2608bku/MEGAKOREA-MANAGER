import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UpdateProfileByAdminRequestBody } from '~/interfaces/admin/admin-actions-user.interface'
import { adminMessages } from '~/constants/messages/admin/admin.messages'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import adminServices from '~/services/admin/admin.service'

export const updateProfileByAdminController = async (
  req: Request<ParamsDictionary, any, UpdateProfileByAdminRequestBody>,
  res: Response
) => {
  const result = await adminServices.updateProfileByAdmin(req.body)
  ResponseSuccess({
    message: adminMessages.UPDATE_PROFILE_BY_ADMIN_SUCCESS,
    res,
    result
  })
}
