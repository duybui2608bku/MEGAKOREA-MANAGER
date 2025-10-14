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

export interface ForgotPasswordRequestBody {
  email: string
}

export interface ResetPasswordRequestBody {
  token: string
  new_password: string
  confirm_password: string
}

export interface VerifyEmailRequestBody {
  email: string
  verification_code: string
}

export interface VerifyOtpRequestBody {
  phone: string
  otp_code: string
}
