import { MenuStatus, MenuType } from '#src/enum/menu/enum.menu.js'

export interface MenuItemType {
  parentId: string | string[]
  _id: string
  menuType: MenuType
  name: string
  path: string
  component: string
  order: number
  icon: string
  currentActiveMenu: string
  keepAlive: number
  hideInMenu: number
  ignoreAccess: number
  status: MenuStatus
  created_at: Date
  updated_at: Date
}
