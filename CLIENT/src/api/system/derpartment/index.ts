import { request } from '#src/utils'
import { MENU_PATH } from '../menu/path'
import { DEPARTMENT_PATH } from './path'
import { DepartmentItemType } from './types'

export function fetchDepartments(params: any) {
  return request
    .get<ApiListResponse<DepartmentItemType>>(DEPARTMENT_PATH.GET_ALL_DEPARTMENTS, {
      searchParams: params,
      ignoreLoading: true
    })
    .json()
}

export function fetchMenuByDeptId(params: { _id: string }) {
  return request
    .get<ApiResponse<string[]>>(`${MENU_PATH.GET_MENU_BY_DEPT_ID}/${params._id}`, {
      ignoreLoading: false
    })
    .json()
}

export function updateDepartment(data: Partial<DepartmentItemType>) {
  return request
    .put<ApiResponse<DepartmentItemType>>(`${DEPARTMENT_PATH.UPDATE_DEPARTMENT}/${data._id}`, { json: data })
    .json()
}

export function createDepartment(data: Partial<DepartmentItemType>) {
  return request.post<ApiResponse<DepartmentItemType>>(DEPARTMENT_PATH.CREATE_DEPARTMENT, { json: data }).json()
}

export function deleteDepartment(id: string) {
  return request.delete<ApiResponse<DepartmentItemType>>(`${DEPARTMENT_PATH.DELETE_DEPARTMENT}/${id}`).json()
}
