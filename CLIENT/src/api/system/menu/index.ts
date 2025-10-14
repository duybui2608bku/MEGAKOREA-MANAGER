import type { MenuItemType } from './types'
import { request } from '#src/utils'
import { MENU_PATH } from './path'

export * from './types'

export function fetchMenuList(data: any) {
  return request
    .get<ApiListResponse<MenuItemType>>(MENU_PATH.GET_ALL_MENUS, { searchParams: data, ignoreLoading: true })
    .json()
}

export function fetchAddMenuItem(data: MenuItemType) {
  return request.post<ApiResponse<string>>('menu-item', { json: data, ignoreLoading: true }).json()
}

export function fetchUpdateMenuItem(data: MenuItemType) {
  return request.put<ApiResponse<string>>('menu-item', { json: data, ignoreLoading: true }).json()
}

export function fetchDeleteMenuItem(id: number) {
  return request.delete<ApiResponse<string>>('menu-item', { json: id, ignoreLoading: true }).json()
}
