import { request } from '#src/utils'
import { HR_API_PATH } from './path'
import { UserInfoType } from '../../user'

export function fetchAllEmployees(params: any) {
  return request
    .get<ApiListResponse<UserInfoType>>(HR_API_PATH.GET_ALL_EMPLOYEES, { searchParams: params, ignoreLoading: true })
    .json()
}
