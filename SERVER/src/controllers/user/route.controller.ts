import { Request, Response } from 'express'
import { User } from '~/models'
import PermissionService from '~/services/permission/permission.service'
import { UserRoleString, UserRole } from '~/constants/enum/user/user.enum'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'
import { ResponseError, ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import { permissionMessages } from '~/constants/messages/permission/permission.messages'
import { globalMessages } from '~/constants/messages/global/global.message'

class RouteController {
  async getAsyncRoutes(req: Request, res: Response) {
    try {
      const userId = req.decoded_authorization?.user_id
      if (!userId) {
        return ResponseError({
          res,
          message: userMessages.ACCESS_TOKEN_IS_REQUIRED,
          statusCode: HttpStatusCode.Unauthorized
        })
      }

      const user = await User.findById(userId).populate('roles')
      if (!user) {
        return ResponseError({
          res,
          message: userMessages.USER_NOT_FOUND,
          statusCode: HttpStatusCode.NotFound
        })
      }

      const userRoles: string[] = []

      if (user.roles && user.roles.length > 0) {
        user.roles.forEach((role: any) => {
          if (role.code) {
            userRoles.push(role.code)
          }
        })
      }

      const roleIds = user.roles ? user.roles.map((role: any) => role._id.toString()) : []
      const userPermissions = await PermissionService.getUserPermissions(roleIds)

      const routes = this.generateRoutesConfig(userRoles, userPermissions as string[])

      return ResponseSuccess({
        res,
        message: permissionMessages.GET_ASYNC_ROUTES_SUCCESS,
        result: routes
      })
    } catch (error) {
      return ResponseError({
        res,
        message: globalMessages.UNKNOWN_ERROR,
        statusCode: HttpStatusCode.InternalServerError
      })
    }
  }

  /**
   * Generate routes configuration based on user roles and permissions
   */

  private generateRoutesConfig(userRoles: string[], userPermissions: string[]) {
    const routes: any[] = []

    if (userRoles.includes('admin')) {
      routes.push({
        path: '/system',
        handle: {
          icon: 'SettingOutlined',
          title: 'common.menu.system',
          roles: ['admin']
        },
        children: [
          {
            path: '/system/user',
            handle: {
              icon: 'UserOutlined',
              title: 'common.menu.user',
              roles: ['admin'],
              permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete']
            }
          },
          {
            path: '/system/role',
            handle: {
              icon: 'TeamOutlined',
              title: 'common.menu.role',
              roles: ['admin'],
              permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete']
            }
          },
          {
            path: '/system/dept',
            handle: {
              icon: 'ApartmentOutlined',
              title: 'common.menu.dept',
              roles: ['admin'],
              permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete']
            }
          }
        ]
      })
    }

    const accessRoutes: any = {
      path: '/access',
      handle: {
        icon: 'SafetyOutlined',
        title: 'Access Control'
      },
      children: []
    }

    if (userPermissions.includes('permission:button:get')) {
      accessRoutes.children.push({
        path: '/access/page-control',
        handle: {
          icon: 'FileTextOutlined',
          title: 'Page Control',
          permissions: ['permission:button:get']
        }
      })
    }

    accessRoutes.children.push({
      path: '/access/button-control',
      handle: {
        icon: 'LockOutlined',
        title: 'Button Control'
      }
    })

    if (userRoles.includes('admin')) {
      accessRoutes.children.push({
        path: '/access/admin-visible',
        handle: {
          icon: 'EyeOutlined',
          title: 'Admin Visible',
          roles: ['admin']
        }
      })
    }

    if (userRoles.includes('common')) {
      accessRoutes.children.push({
        path: '/access/common-visible',
        handle: {
          icon: 'EyeOutlined',
          title: 'Common Visible',
          roles: ['common']
        }
      })
    }

    if (accessRoutes.children.length > 0) {
      routes.push(accessRoutes)
    }
    return routes
  }
}

export default new RouteController()
