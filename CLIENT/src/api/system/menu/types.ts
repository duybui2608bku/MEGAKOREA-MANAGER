import { MenuStatus, MenuType } from '#src/enum/menu/enum.menu.js'

export interface MenuItemType {
  parentId: string
  _id: string
  menuType: MenuType
  name: string
  path: string
  component: string
  order: number
  icon: string
  currentActiveMenu: string
  iframeLink: string
  keepAlive: number
  externalLink: string
  hideInMenu: number
  ignoreAccess: number
  status: MenuStatus
  createTime: number
  updateTime: number
}
