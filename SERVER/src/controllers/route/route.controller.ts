import { Request, Response } from 'express'
import { User } from '~/models'
import permissionService from '~/services/permission/permission.service'
import menuService from '~/services/menu/menu.service'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'
import { ResponseError, ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import { PERMISSION_MESSAGES } from '~/constants/messages/permission/permission.messages'

class RouteController {
  async getAsyncRoutes(req: Request, res: Response) {
    const user_id = req.user?._id as string
    const user = await User.findById(user_id).populate('roles')
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

    const userPermissions = await permissionService.getUserPermissions(roleIds)

    const routes = await menuService.generateRoutesFromDB(userRoles, userPermissions as string[])

    return ResponseSuccess({
      res,
      message: PERMISSION_MESSAGES.GET_ASYNC_ROUTES_SUCCESS,
      result: routes
    })
  }
}

const routeController = new RouteController()

export default routeController
