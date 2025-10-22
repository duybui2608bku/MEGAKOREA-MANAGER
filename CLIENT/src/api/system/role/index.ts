import type { RoleItemType } from './types'
import { request } from '#src/utils'
import { ROLE_PATH } from './path'

export * from './types'

/* 获取角色列表 */

export function fetchRoleList(data: any) {
  return request.get<ApiListResponse<RoleItemType>>(ROLE_PATH.LIST, { searchParams: data, ignoreLoading: true }).json()
}

/* 新增角色 */
export function fetchAddRoleItem(data: RoleItemType) {
  return request.post<ApiResponse<string>>(ROLE_PATH.CREATE, { json: data, ignoreLoading: true }).json()
}

export function fetchUpdateRoleItem(data: RoleItemType) {
  return request.put<ApiResponse<string>>(`${ROLE_PATH.UPDATE}/${data._id}`, { json: data, ignoreLoading: true }).json()
}

/* 删除角色 */
export function fetchDeleteRoleItem(id: string) {
  return request.delete<ApiResponse<string>>(`${ROLE_PATH.DELETE}/${id}`, { ignoreLoading: true }).json()
}

/* 获取菜单 */
export function fetchRoleMenu() {
  return request.get<ApiResponse<RoleItemType[]>>('role-menu', { ignoreLoading: true }).json()
}

/* 角色绑定的菜单 id */
export function fetchMenuByDeptId(data: { _id: string }) {
  return request.get<ApiResponse<string[]>>('menu-by-dept-id', { searchParams: data, ignoreLoading: false }).json()
}
