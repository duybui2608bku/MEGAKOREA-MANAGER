import { TokenPayload } from './src/interfaces/user/users.interface'
import User from './src/models/user/user.model'

declare module 'express' {
  interface Request {
    user?: typeof User
    decode_authorization?: TokenPayload
  }
}
