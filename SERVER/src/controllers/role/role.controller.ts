import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import roleService from '~/services/role/role.service'
import {
  CreateRoleRequestBody,
  UpdateRoleRequestBody,
  AssignPermissionsRequestBody
} from '~/interfaces/role/role.interface'
import { ROLE_MESSAGES } from '~/constants/messages/roles/role.messagge'

export const createRoleController = async (
  req: Request<ParamsDictionary, any, CreateRoleRequestBody>,
  res: Response
) => {
  const result = await roleService.createRole(req.body)
  ResponseSuccess({
    message: ROLE_MESSAGES.CREATE_SUCCESS,
    res,
    result
  })
}

export const getRolesController = async (req: Request, res: Response) => {
  const result = await roleService.getAllRoles()
  ResponseSuccess({
    message: ROLE_MESSAGES.GET_ALL_SUCCESS,
    res,
    result
  })
}

export const getRoleByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await roleService.getRoleById(id)
  ResponseSuccess({
    message: ROLE_MESSAGES.GET_BY_ID_SUCCESS,
    res,
    result
  })
}

export const updateRoleController = async (
  req: Request<ParamsDictionary, any, UpdateRoleRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await roleService.updateRole(id, req.body)
  ResponseSuccess({
    message: ROLE_MESSAGES.UPDATE_SUCCESS,
    res,
    result
  })
}

export const deleteRoleController = async (req: Request, res: Response) => {
  const { id } = req.params
  await roleService.deleteRole(id)
  ResponseSuccess({
    message: ROLE_MESSAGES.DELETE_SUCCESS,
    res
  })
}

// export const assignPermissionsToRoleController = async (
//   req: Request<ParamsDictionary, any, AssignPermissionsRequestBody>,
//   res: Response
// ) => {
//   const { id } = req.params
//   const result = await roleService.assignPermissionsToRole(id, req.body)
//   ResponseSuccess({
//     message: ROLE_MESSAGES.ASSIGN_PERMISSIONS_SUCCESS,
//     res,
//     result
//   })
// }
