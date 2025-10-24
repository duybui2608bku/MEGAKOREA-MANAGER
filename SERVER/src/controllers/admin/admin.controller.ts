import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  UpdateProfileByAdminRequestBody,
  UpdateUserStatusRequestBody,
  AssignUserRoleRequestBody,
  AssignUserDepartmentRequestBody
} from '~/interfaces/admin/admin-actions-user.interface'
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

export const getAllUsersController = async (req: Request, res: Response) => {
  // const result = await adminServices.getAllUsers(req.query)
  ResponseSuccess({
    message: '',
    res
    // result
  })
}

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await adminServices.getUserById(id)
  ResponseSuccess({
    message: 'User retrieved successfully',
    res,
    result
  })
}

export const updateUserStatusController = async (
  req: Request<ParamsDictionary, any, UpdateUserStatusRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await adminServices.updateUserStatus(id, req.body)
  ResponseSuccess({
    message: 'User status updated successfully',
    res,
    result
  })
}

export const assignUserRoleController = async (
  req: Request<ParamsDictionary, any, AssignUserRoleRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await adminServices.assignUserRole(id, req.body)
  ResponseSuccess({
    message: 'User role assigned successfully',
    res,
    result
  })
}

export const assignUserDepartmentController = async (
  req: Request<ParamsDictionary, any, AssignUserDepartmentRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await adminServices.assignUserDepartment(id, req.body)
  ResponseSuccess({
    message: 'User department assigned successfully',
    res,
    result
  })
}

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  await adminServices.deleteUser(id)
  ResponseSuccess({
    message: 'User deleted successfully',
    res
  })
}
