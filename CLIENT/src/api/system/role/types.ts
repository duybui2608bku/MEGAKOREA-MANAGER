import { RoleStatusEnum } from '#src/pages/system/role/enum/index.js'

export interface PermissionItemType {
  _id: string
  action: string
}

export interface RoleItemType {
  _id: string
  name: string
  code: string
  description: string
  status: RoleStatusEnum
  permissions: PermissionItemType[]
  created_at: number
  updated_at: number
}
