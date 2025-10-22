import { DerpartmentStatus } from '#src/pages/system/dept/enum/index.js'

export interface DepartmentItemType {
  _id: string
  name: string
  description: string
  status: DerpartmentStatus
  code: string
  assigned_menus: string[]
  created_at: Date
  updated_at: Date
}
