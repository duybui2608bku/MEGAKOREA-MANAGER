import { CreateRoleRequestBody, UpdateRoleRequestBody } from '~/interfaces/role/role.interface'
import roleRepository from '~/repository/role/role.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { ROLE_MESSAGES } from '~/constants/messages/roles/role.messagge'

class RoleService {
  private async checkRoleNameExists(name: string | undefined) {
    if (!name) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.NAME_REQUIRED,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const existingRole = await roleRepository.getRoleByName(name)
    if (existingRole) {
      throw new ErrorWithStatusCode({
        message: ROLE_MESSAGES.NAME_ALREADY_EXISTS,
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
    await this.checkRoleNameExists(roleData.name || '')
    const role = await roleRepository.createRole(roleData)
    return role
  }

  async getAllRoles() {
    const [roles, total] = await Promise.all([roleRepository.getAllRoles(), roleRepository.getTotalRoles()])
    return {
      list: roles,
      total,
      current: 0
    }
  }

  async getRoleById(roleId: string) {
    const role = await this.checkRoleExists(roleId)
    return role
  }

  async updateRole(roleId: string, updateData: UpdateRoleRequestBody) {
    const existingRole = await this.checkRoleExists(roleId)

    if (updateData.name && updateData.name !== existingRole.name) {
      const nameConflict = await roleRepository.getRoleByName(updateData.name || existingRole.name)
      if (nameConflict && nameConflict._id.toString() !== roleId) {
        throw new ErrorWithStatusCode({
          message: ROLE_MESSAGES.NAME_ALREADY_EXISTS,
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

  async assignPermissionsToRole(roleId: string, permissions: string[]) {
    await this.checkRoleExists(roleId)
    const updatedRole = await roleRepository.assignPermissionsToRole(roleId, permissions)
    return updatedRole
  }
}

const roleService = new RoleService()
export default roleService
