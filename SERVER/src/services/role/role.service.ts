import {
  CreateRoleRequestBody,
  UpdateRoleRequestBody,
  AssignPermissionsRequestBody
} from '~/interfaces/role/role.interface'
import roleRepository from '~/repository/role/role.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { ROLE_MESSAGES } from '~/constants/messages/roles/role.messagge'

class RoleService {
  private async checkRoleNameOrCodeExists(name: string | undefined, code: string | undefined) {
    if (!name || !code) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.NAME_OR_CODE_REQUIRED,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const existingRole = await roleRepository.getRoleByNameOrCode(name, code)
    if (existingRole) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.NAME_OR_CODE_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }
  }

  private async checkRoleExists(roleId: string) {
    const existingRole = await roleRepository.getRoleById(roleId)
    if (!existingRole) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.ROLE_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return existingRole
  }

  async createRole(roleData: CreateRoleRequestBody) {
    this.checkRoleNameOrCodeExists(roleData.name || '', roleData.code || '')

    const role = await roleRepository.createRole(roleData)
    return role
  }

  async getAllRoles() {
    const roles = await roleRepository.getAllRoles()
    return roles
  }

  async getRoleById(roleId: string) {
    const role = await this.checkRoleExists(roleId)
    return role
  }

  async updateRole(roleId: string, updateData: UpdateRoleRequestBody) {
    const existingRole = await this.checkRoleExists(roleId)

    this.checkRoleNameOrCodeExists(updateData.name || '', updateData.code || '')

    if (
      (updateData.name && updateData.name !== existingRole.name) ||
      (updateData.code && updateData.code !== existingRole.code)
    ) {
      const nameCodeConflict = await roleRepository.getRoleByNameOrCode(
        updateData.name || existingRole.name,
        updateData.code || existingRole.code
      )
      if (nameCodeConflict && nameCodeConflict._id.toString() !== roleId) {
        throw new ErrorWithStatusCode({
          message: ROLE_MESSAGES.NAME_OR_CODE_ALREADY_EXISTS,
          statusCode: HttpStatusCode.BadRequest
        })
      }
    }

    const updatedRole = await roleRepository.updateRole(roleId, updateData)
    return updatedRole
  }

  async deleteRole(roleId: string) {
    await this.checkRoleExists(roleId)
    const usersWithRole = await roleRepository.getUsersWithRole(roleId)
    if (usersWithRole.length > 0) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.CANNOT_DELETE_ROLE_ASSIGNED_TO_USERS,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    await roleRepository.deleteRole(roleId)
    return { message: ROLE_MESSAGES.DELETE_SUCCESS }
  }

  async assignPermissionsToRole(roleId: string, permissionsData: AssignPermissionsRequestBody) {
    await this.checkRoleExists(roleId)
    const updatedRole = await roleRepository.assignPermissionsToRole(roleId, permissionsData.permissionIds)
    return updatedRole
  }
}

const roleService = new RoleService()
export default roleService
