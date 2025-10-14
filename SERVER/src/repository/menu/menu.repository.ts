import { Menu } from '~/models'
import { CreateMenuRequestBody, UpdateMenuRequestBody, GetMenusQuery } from '~/interfaces/menu/menu.interface'
import { generatePagination } from '~/utils/pagination/pagination.util'

class MenuRepository {
  async createMenu(menuData: CreateMenuRequestBody) {
    const menu = new Menu({
      ...menuData,
      created_at: new Date(),
      updated_at: new Date()
    })
    return await menu.save()
  }

  async getAllMenus(query: GetMenusQuery = {}) {
    const filter: any = {}

    if (query.status) {
      filter.status = parseInt(query.status)
    }

    if (query.parentId) {
      filter.parentId = query.parentId
    }

    if (query.roles) {
      filter.roles = { $in: [query.roles] }
    }

    const { current, pageSize, skip } = generatePagination(query.current, query.pageSize)

    const total = await Menu.countDocuments(filter)

    const list = await Menu.find(filter)
      // .populate('parentId', 'name title')
      // .sort({ order: 1, created_at: 1 })
      .skip(skip)
      .limit(pageSize)

    return {
      list,
      total,
      current
    }
  }

  async getMenuById(menuId: string) {
    return await Menu.findById(menuId).populate('parentId', 'name title')
  }

  async getMenuByName(name: string) {
    return await Menu.findOne({ name })
  }

  async updateMenu(menuId: string, updateData: UpdateMenuRequestBody) {
    return await Menu.findByIdAndUpdate(menuId, { ...updateData, updated_at: new Date() }, { new: true }).populate(
      'parentId',
      'name title'
    )
  }

  async deleteMenu(menuId: string) {
    return await Menu.findByIdAndDelete(menuId)
  }

  async getChildrenMenus(parentId: string) {
    return await Menu.find({ parentId })
  }

  async getActiveMenusForUser(userRoles: string[], userPermissions: string[]) {
    const filter: any = { status: 1 }

    const menus = await Menu.find(filter).sort({ order: 1, created_at: 1 })

    return menus.filter((menu) => {
      if (menu.roles && menu.roles.length > 0) {
        const hasRole = menu.roles.some((role) => userRoles.includes(role))
        if (!hasRole) return false
      }

      if (menu.permissions && menu.permissions.length > 0) {
        const hasPermission = menu.permissions.some((permission) => userPermissions.includes(permission))
        if (!hasPermission) return false
      }

      return true
    })
  }
}

const menuRepository = new MenuRepository()
export default menuRepository
