import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum/user/user.enum'

export interface TokenPayload extends JwtPayload {
  user_id: string
  role: number
  token_type: TokenType
  branch_id: string
}

export interface RegisterRequestBody {
  name: string
  email: string
  phone: string
  password: string
  gender: number
  date_of_birth: Date
  address?: string
  derpartment: string
  titles: number
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface ChangePasswordRequestBody {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface UpdateMyProfileRequestBody {
  name?: string
  phone?: string
  date_of_birth?: Date
  address?: string
  avatar?: string
  gender?: number
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}
