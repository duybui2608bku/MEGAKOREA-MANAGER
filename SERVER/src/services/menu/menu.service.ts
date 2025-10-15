import { CreateMenuRequestBody, UpdateMenuRequestBody, GetMenusQuery } from '~/interfaces/menu/menu.interface'
import menuRepository from '~/repository/menu/menu.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { MENU_MESSAGES } from '~/constants/messages/menu/menu.message'

class MenuService {
  private async checkMenuExists(id: string, message?: string) {
    const existingMenu = await menuRepository.getMenuById(id)
    if (!existingMenu) {
      throw new ErrorWithStatusCode({
        message: message || MENU_MESSAGES.MENU_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return existingMenu
  }

  private async checkMenuNameExists(name: string, message?: string) {
    const existingMenu = await menuRepository.getMenuByName(name)
    if (existingMenu) {
      throw new ErrorWithStatusCode({
        message: message || MENU_MESSAGES.MENU_NAME_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    return existingMenu
  }

  async createMenu(menuData: CreateMenuRequestBody) {
    await this.checkMenuNameExists(menuData.name, MENU_MESSAGES.MENU_NAME_ALREADY_EXISTS)

    if (menuData.parentId) {
      await this.checkMenuExists(menuData.parentId, MENU_MESSAGES.PARENT_MENU_NOT_FOUND)
    }

    const menu = await menuRepository.createMenu(menuData)
    return menu
  }

  async getAllMenus(query: GetMenusQuery) {
    const result = await menuRepository.getAllMenus(query)
    return result
  }

  async getMenuById(menuId: string) {
    const menu = await this.checkMenuExists(menuId)
    return menu
  }

  async updateMenu(menuId: string, updateData: UpdateMenuRequestBody) {
    const existingMenu = await this.checkMenuExists(menuId)

    if (updateData.name && updateData.name !== existingMenu.name) {
      await this.checkMenuNameExists(updateData.name)
    }

    if (updateData.parentId && updateData.parentId !== existingMenu.parentId?.toString()) {
      await this.checkMenuExists(updateData.parentId, MENU_MESSAGES.PARENT_MENU_NOT_FOUND)
    }

    const updatedMenu = await menuRepository.updateMenu(menuId, updateData)
    return updatedMenu
  }

  async deleteMenu(menuId: string) {
    await menuRepository.getMenuById(menuId)
    const childrenMenus = await menuRepository.getChildrenMenus(menuId)

    if (childrenMenus.length > 0) {
      throw new ErrorWithStatusCode({
        message: MENU_MESSAGES.MENU_HAS_CHILDREN,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    await menuRepository.deleteMenu(menuId)
    return { message: MENU_MESSAGES.MENU_DELETED_SUCCESS }
  }

  async generateRoutesFromDB(userRoles: string[], userPermissions: string[]) {
    const menus = await menuRepository.getActiveMenusForUser(userRoles, userPermissions)
    return this.buildMenuTree(menus)
  }

  private buildMenuTree(menus: any[]) {
    const menuMap = new Map()
    const rootMenus: any[] = []
    menus.forEach((menu) => {
      const menuItem = {
        path: menu.path,
        component: menu.component,
        handle: {
          icon: menu.icon,
          title: menu.title,
          order: menu.order,
          roles: menu.roles,
          permissions: menu.permissions,
          keepAlive: menu.keepAlive,
          externalLink: menu.externalLink,
          iframeLink: menu.iframeLink
        },
        children: []
      }

      menuMap.set(menu._id.toString(), menuItem)
    })

    menus.forEach((menu) => {
      const menuItem = menuMap.get(menu._id.toString())

      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId.toString())
        if (parent) {
          parent.children.push(menuItem)
        }
      } else {
        rootMenus.push(menuItem)
      }
    })

    const cleanTree = (items: any[]) => {
      return items
        .map((item) => {
          if (item.children && item.children.length > 0) {
            item.children = cleanTree(item.children)
          } else {
            delete item.children
          }
          return item
        })
        .sort((a, b) => (a.handle?.order || 0) - (b.handle?.order || 0))
    }

    return cleanTree(rootMenus)
  }
}

const menuService = new MenuService()
export default menuService
