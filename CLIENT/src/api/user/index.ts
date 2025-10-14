import type { PasswordLoginFormType } from '#src/pages/login/components/password-login'
import type { AppRouteRecordRaw } from '#src/router/types'
import type { AuthType, UserInfoType } from './types'
import { request } from '#src/utils'
import { USER_PATH } from './path'

export * from './types'

export function fetchLogin(data: PasswordLoginFormType) {
  return request.post(USER_PATH.LOGIN, { json: data }).json<ApiResponse<AuthType>>()
}

export function fetchLogout() {
  return request.post(USER_PATH.LOGOUT).json()
}

export function fetchAsyncRoutes() {
  return request.get(USER_PATH.GET_ASYNC_ROUTES).json<ApiResponse<AppRouteRecordRaw[]>>()
}

export function fetchUserInfo() {
  return request.get(USER_PATH.USER_INFO).json<ApiResponse<UserInfoType>>()
}

export interface RefreshTokenResult {
  access_token: string
  refresh_token: string
}

export function fetchRefreshToken(data: { readonly refresh_token: string }) {
  return request.post(USER_PATH.REFRESH_TOKEN, { json: data }).json<ApiResponse<RefreshTokenResult>>()
}
