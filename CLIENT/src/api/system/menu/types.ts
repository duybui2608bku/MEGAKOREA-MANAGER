import { MenuStatus } from '#src/enum/menu/enum.menu.js'

export interface MenuItemType {
  parentId: string | string[]
  _id: string
  name: string
  path: string
  component: string
  order: number
  icon: string
  roles: string[]
  currentActiveMenu: string
  keepAlive: boolean
  hideInMenu: boolean
  ignoreAccess: boolean
  status: MenuStatus
  created_at: Date
  updated_at: Date
}
