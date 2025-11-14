import { AppRouteRecordRaw } from '#src/router/types.js'
import { RoleItemType } from '../system'
import { DepartmentItemType } from '../system/derpartment/types'

export interface AuthType {
  access_token: string
  refresh_token: string
  user: UserInfoType | null
}

export interface UserInfoType {
  _id: string
  email: string
  name: string
  phone: string
  gender: number
  avatar: string
  date_of_birth: Date
  address: string
  status: number
  // roles: Partial<RoleItemType>
  roles: any[]
  department: Partial<DepartmentItemType>
  menus?: AppRouteRecordRaw[]
}

export interface AuthListProps {
  label: string
  name: string
  auth: string[]
}

export interface UpdateMyProfileRequestBody {
  name?: string
  phone?: string
  date_of_birth?: Date
  address?: string
  avatar?: string
  gender?: number
}
