import { request } from '#src/utils'
import { HR_API_PATH } from './path'
import { UserInfoType } from '../../user'
import { UpdateEmployeeRequestBody } from './types'

export function fetchAllEmployees(params: any) {
  return request
    .get<ApiListResponse<UserInfoType>>(HR_API_PATH.GET_ALL_EMPLOYEES, { searchParams: params, ignoreLoading: true })
    .json()
}

export function fetchUpdateEmployee(data: UpdateEmployeeRequestBody) {
  return request.patch<ApiResponse<UserInfoType>>(HR_API_PATH.UPDATE_EMPLOYEE, { json: data }).json()
}

export function fetchDeleteEmployee(id: string) {
  return request.delete<ApiResponse<void>>(`${HR_API_PATH.DELETE_EMPLOYEE}/${id}`).json()
}
