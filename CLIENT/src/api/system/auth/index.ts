import { request } from '#src/utils'
import { RegisterFormType } from './type'

export const fetchRegister = (data: RegisterFormType) => {
  return request.post('/auth/register', { json: data }).json()
}
