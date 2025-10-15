import { request } from '#src/utils'
import { DEPARTMENT_PATH } from './path'
import { DepartmentItemType } from './types'

export function fetchDepartments() {
  return request
    .get<ApiListResponse<DepartmentItemType>>(DEPARTMENT_PATH.GET_ALL_DEPARTMENTS, {
      ignoreLoading: true
    })
    .json()
}
