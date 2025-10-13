import { Request, Response, NextFunction } from 'express'
import { User } from '~/models'
import PermissionService from '~/services/permission/permission.service'
import { UserRole, UserRoleString } from '~/constants/enum/user/user.enum'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'
import { permissionMessages } from '~/constants/messages/permission/permission.messages'
import { globalMessages } from '~/constants/messages/global/global.message'
import { PermissionRoles } from '~/constants/enum/permision/permission.enum'

export const requireRoles = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded_authorization?.user_id
      if (!userId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: userMessages.ACCESS_TOKEN_IS_REQUIRED
        })
      }

      const user = await User.findById(userId).populate('roles')
      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: userMessages.USER_NOT_FOUND
        })
      }

      const userRoles: string[] = []

      // Get roles from populated roles array
      if (user.roles && user.roles.length > 0) {
        user.roles.forEach((role: any) => {
          if (role.code) {
            userRoles.push(role.code)
          }
        })
      }

      const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))

      if (!hasRequiredRole) {
        return res.status(HttpStatusCode.Forbidden).json({
          message: permissionMessages.DO_NOT_HAVE_PERMISSION
        })
      }

      req.userRoles = userRoles
      next()
    } catch (error) {
      return res.status(HttpStatusCode.InternalServerError).json({
        message: permissionMessages.PERMISSION_CHECK_ERROR,
        error: error instanceof Error ? error.message : globalMessages.UNKNOWN_ERROR
      })
    }
  }
}

export const requirePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded_authorization?.user_id
      if (!userId) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: userMessages.ACCESS_TOKEN_IS_REQUIRED
        })
      }

      const user = await User.findById(userId).populate('roles')
      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: userMessages.USER_NOT_FOUND
        })
      }

      const roleIds = user.roles ? user.roles.map((role: any) => role._id.toString()) : []

      for (const permission of requiredPermissions) {
        const hasPermission = await PermissionService.hasPermission(roleIds, permission)
        if (!hasPermission) {
          return res.status(HttpStatusCode.Forbidden).json({
            message: `Missing permission: ${permission}`
          })
        }
      }

      next()
    } catch (error) {
      return res.status(HttpStatusCode.InternalServerError).json({
        message: permissionMessages.PERMISSION_CHECK_ERROR,
        error: error instanceof Error ? error.message : globalMessages.UNKNOWN_ERROR
      })
    }
  }
}

export const adminOnly = requireRoles([PermissionRoles.ADMIN])

export const adminOrManager = requireRoles([PermissionRoles.ADMIN, PermissionRoles.MANAGER])
