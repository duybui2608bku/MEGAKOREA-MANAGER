import { Request } from 'express'
import User from '~/models/user/user.model'
import { TokenPayload } from '~/interfaces/user/users.interface'

declare module 'express' {
  interface Request {
    user?: User
    decode_authorization?: TokenPayload
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    userRoles?: string[]
  }
}
