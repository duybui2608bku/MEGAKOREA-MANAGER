import {
  CreatePermissionRequestBody,
  UpdatePermissionRequestBody,
  GetPermissionsQuery
} from '~/interfaces/permission/permission.interface'

import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import permissionRepository from '~/repository/permission/permission.repository'
import { PERMISSION_MESSAGES } from '~/constants/messages/permission/permission.messages'

class PermissionService {
  private async checkPermissionExists(permissionId: string) {
    const existingPermission = await permissionRepository.getPermissionById(permissionId)
    if (!existingPermission) {
      throw new ErrorWithStatusCode({
        message: PERMISSION_MESSAGES.PERMISSION_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return existingPermission
  }

  async createPermission(permissionData: CreatePermissionRequestBody) {
    const existingPermission = await permissionRepository.getPermissionByCode(permissionData.code)
    if (existingPermission) {
      throw new ErrorWithStatusCode({
        message: PERMISSION_MESSAGES.PERMISSION_CODE_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const permission = await permissionRepository.createPermission(permissionData)
    return permission
  }

  async getAllPermissions(query: GetPermissionsQuery) {
    const permissions = await permissionRepository.getAllPermissions(query)
    return permissions
  }

  async getPermissionById(permissionId: string) {
    const permission = await this.checkPermissionExists(permissionId)
    return permission
  }

  async updatePermission(permissionId: string, updateData: UpdatePermissionRequestBody) {
    const existingPermission = await this.checkPermissionExists(permissionId)
    if (updateData.code && updateData.code !== existingPermission.code) {
      const codeConflict = await permissionRepository.getPermissionByCode(updateData.code)
      if (codeConflict) {
        throw new ErrorWithStatusCode({
          message: PERMISSION_MESSAGES.PERMISSION_CODE_ALREADY_EXISTS,
          statusCode: HttpStatusCode.BadRequest
        })
      }
    }

    const updatedPermission = await permissionRepository.updatePermission(permissionId, updateData)
    return updatedPermission
  }

  async deletePermission(permissionId: string) {
    await this.checkPermissionExists(permissionId)
    const rolesWithPermission = await permissionRepository.getRolesWithPermission(permissionId)
    if (rolesWithPermission.length > 0) {
      throw new ErrorWithStatusCode({
        message: PERMISSION_MESSAGES.CANNOT_DELETE_PERMISSION_ASSIGNED_TO_ROLES,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    await permissionRepository.deletePermission(permissionId)
    return { message: PERMISSION_MESSAGES.DELETE_SUCCESS }
  }

  async getUserPermissions(roleIds: string[]): Promise<string[]> {
    if (!roleIds || roleIds.length === 0) {
      return []
    }

    const permissions = await permissionRepository.getPermissionsByRoleIds(roleIds)
    return permissions.map((permission: any) => permission.code)
  }
}

const permissionService = new PermissionService()
export default permissionService
