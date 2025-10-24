import { request } from '#src/utils'
import { AUTH_PATH } from './path'
import { RegisterFormType } from './type'

export const fetchRegister = (data: RegisterFormType) => {
  return request.post(AUTH_PATH.REGISTER, { json: data }).json<ApiResponse<void>>()
}
