import { AppRouteRecordRaw } from '#src/router/types.js'

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
  roles: any[]
  derpartment: string
  titles: number
  menus?: AppRouteRecordRaw[]
}

export interface AuthListProps {
  label: string
  name: string
  auth: string[]
}
