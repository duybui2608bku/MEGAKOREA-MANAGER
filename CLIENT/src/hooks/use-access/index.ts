import { useUserStore } from '#src/store'
import { isString } from '#src/utils'
import { useMatches } from 'react-router'
import { accessControlCodes, AccessControlRoles } from './constants'

export * from './constants'

/**
 * @zh 权限判断
 * @en Access judgment
 *
 * @description
 * Hook dùng để kiểm tra quyền truy cập của người dùng hiện tại.
 * Hỗ trợ kiểm tra theo “mã quyền” (permission codes) hoặc theo “vai trò” (roles).
 */

export function useAccess() {
  const matches = useMatches() // Lấy danh sách các route khớp với URL hiện tại (React Router)
  const { roles: userRoles } = useUserStore() // Lấy thông tin vai trò (roles) của user từ store
  const currentRoute = matches[matches.length - 1] // Lấy route hiện tại (route sâu nhất)

  /**
   * @zh 根据权限代码判断当前路由是否具有指定权限
   * @en Determine whether the current route has a specified permission based on permission codes
   *
   * @param permission - Tên quyền hoặc mảng tên quyền (chữ thường), ví dụ ["add", "delete"]
   * @returns boolean - Trả về true nếu có quyền, ngược lại trả về false
   */
  const hasAccessByCodes = (permission?: string | Array<string>) => {
    if (!permission) return false

    // Lấy danh sách quyền được khai báo trong route hiện tại (handle.permissions)
    const metaAuth = currentRoute?.handle?.permissions
    if (!metaAuth) {
      return false
    }

    // Chuyển permission về mảng, đồng thời đổi về chữ thường để so sánh
    permission = isString(permission) ? [permission] : permission
    permission = permission.map((item) => item.toLowerCase())

    // Trong môi trường DEV, kiểm tra xem mã quyền có hợp lệ không
    if (import.meta.env.DEV) {
      for (const code of permission) {
        if (!Object.values(accessControlCodes).includes(code)) {
          console.warn(`[hasAccessByCodes]: '${code}' không phải là mã quyền hợp lệ`)
        }
      }
    }

    // Kiểm tra xem trong route hiện tại có quyền khớp nào không
    const isAuth = metaAuth.some((item) => permission.includes(item.toLowerCase()))
    return isAuth
  }

  /**
   * @zh 根据角色判断当前用户是否具有指定权限
   * @en Determine whether the current user has a specified permission based on roles
   *
   * @param roles - Tên vai trò hoặc mảng vai trò (chữ thường), ví dụ ["admin", "user"]
   * @returns boolean - Trả về true nếu user có vai trò phù hợp, ngược lại trả về false
   */
  const hasAccessByRoles = (roles?: string | Array<string>) => {
    if (!roles || !userRoles) {
      return false
    }

    // Chuyển roles về mảng và viết thường
    roles = isString(roles) ? [roles] : roles
    roles = roles.map((item) => item.toLowerCase())

    // Trong môi trường DEV, cảnh báo nếu role không hợp lệ
    if (import.meta.env.DEV) {
      for (const roleItem of roles) {
        if (!Object.values(AccessControlRoles).includes(roleItem)) {
          console.warn(`[hasAccessByRoles]: '${roleItem}' không phải là role hợp lệ`)
        }
      }
    }

    // Kiểm tra xem user có role nào nằm trong danh sách yêu cầu không
    const isAuth = userRoles.some((item) => roles.includes(item.toLowerCase()))
    return isAuth
  }

  return { hasAccessByCodes, hasAccessByRoles }
}
