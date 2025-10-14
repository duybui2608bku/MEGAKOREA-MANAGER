import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import permissionService from '~/services/permission/permission.service'
import { CreatePermissionRequestBody, UpdatePermissionRequestBody } from '~/interfaces/permission/permission.interface'
import { PERMISSION_MESSAGES } from '~/constants/messages/permission/permission.messages'

export const createPermissionController = async (
  req: Request<ParamsDictionary, any, CreatePermissionRequestBody>,
  res: Response
) => {
  const result = await permissionService.createPermission(req.body)
  ResponseSuccess({
    message: PERMISSION_MESSAGES.CREATE_SUCCESS,
    res,
    result
  })
}

export const getPermissionsController = async (req: Request, res: Response) => {
  const { module = '', action = '' } = req.query
  const result = await permissionService.getAllPermissions({
    module: module as string,
    action: action as string
  })
  ResponseSuccess({
    message: PERMISSION_MESSAGES.GET_ALL_SUCCESS,
    res,
    result
  })
}

export const getPermissionByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await permissionService.getPermissionById(id)
  ResponseSuccess({
    message: PERMISSION_MESSAGES.GET_BY_ID_SUCCESS,
    res,
    result
  })
}

export const updatePermissionController = async (
  req: Request<ParamsDictionary, any, UpdatePermissionRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await permissionService.updatePermission(id, req.body)
  ResponseSuccess({
    message: PERMISSION_MESSAGES.UPDATE_SUCCESS,
    res,
    result
  })
}

export const deletePermissionController = async (req: Request, res: Response) => {
  const { id } = req.params
  await permissionService.deletePermission(id)
  ResponseSuccess({
    message: PERMISSION_MESSAGES.DELETE_SUCCESS,
    res
  })
}
