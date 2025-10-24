import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import {
  UpdateProfileByAdminRequestBody,
  UpdateUserStatusRequestBody
} from '~/interfaces/admin/admin-actions-user.interface'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import adminServices from '~/services/admin/admin.service'
import hrRepository from '~/repository/workspace/hr'
import { GetAllEmployeesQuery } from '~/interfaces/workspace/hr'
import { HR_MESSAGES } from '~/constants/messages/workspace/hr'

export const updateEmployeeProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileByAdminRequestBody>,
  res: Response
) => {
  const result = await hrRepository.updateEmployeeProfile(req.body)
  ResponseSuccess({
    message: HR_MESSAGES.UPDATE_EMPLOYEE_PROFILE_SUCCESS,
    res,
    result
  })
}

export const getAllEmployeesController = async (req: Request, res: Response) => {
  const query = req.query as GetAllEmployeesQuery
  const result = await hrRepository.getAllEmployees(query)
  ResponseSuccess({
    message: HR_MESSAGES.GET_ALL_EMPLOYEES_SUCCESS,
    res,
    result
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

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  await adminServices.deleteUser(id)
  ResponseSuccess({
    message: 'User deleted successfully',
    res
  })
}
