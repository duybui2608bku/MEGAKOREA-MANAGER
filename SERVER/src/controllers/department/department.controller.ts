import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import departmentService from '~/services/department/department.service'
import { CreateDepartmentRequestBody, UpdateDepartmentRequestBody } from '~/interfaces/department/department.interface'
import { DEPARTMENT_MESSAGES } from '~/constants/messages/derpartment/derpartment.message'

export const createDepartmentController = async (
  req: Request<ParamsDictionary, any, CreateDepartmentRequestBody>,
  res: Response
) => {
  const result = await departmentService.createDepartment(req.body)
  ResponseSuccess({
    message: DEPARTMENT_MESSAGES.CREATE_SUCCESS,
    res,
    result
  })
}

export const getDepartmentsController = async (req: Request, res: Response) => {
  const result = await departmentService.getAllDepartments()
  ResponseSuccess({
    message: DEPARTMENT_MESSAGES.GET_ALL_SUCCESS,
    res,
    result
  })
}

export const getDepartmentByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await departmentService.getDepartmentById(id)
  ResponseSuccess({
    message: DEPARTMENT_MESSAGES.GET_BY_ID_SUCCESS,
    res,
    result
  })
}

export const updateDepartmentController = async (
  req: Request<ParamsDictionary, any, UpdateDepartmentRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await departmentService.updateDepartment(id, req.body)
  ResponseSuccess({
    message: DEPARTMENT_MESSAGES.UPDATE_SUCCESS,
    res,
    result
  })
}

export const deleteDepartmentController = async (req: Request, res: Response) => {
  const { id } = req.params
  await departmentService.deleteDepartment(id)
  ResponseSuccess({
    message: DEPARTMENT_MESSAGES.DELETE_SUCCESS,
    res
  })
}
