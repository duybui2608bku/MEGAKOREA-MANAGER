import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'

import hrRepository from '~/repository/workspace/hr'
import { GetAllEmployeesQuery, UpdateEmployeeProfileRequestBody } from '~/interfaces/workspace/hr'
import { HR_MESSAGES } from '~/constants/messages/workspace/hr'

export const updateEmployeeProfileController = async (
  req: Request<ParamsDictionary, any, UpdateEmployeeProfileRequestBody>,
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

export const deleteEmployeeController = async (req: Request, res: Response) => {
  const { id } = req.params
  await hrRepository.deleteUser(id)
  ResponseSuccess({
    message: HR_MESSAGES.DELETE_EMPLOYEE_SUCCESS,
    res
  })
}
