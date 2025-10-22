import { Role, User } from '~/models'
import { CreateRoleRequestBody, UpdateRoleRequestBody } from '~/interfaces/role/role.interface'

class RoleRepository {
  async createRole(roleData: CreateRoleRequestBody) {
    const role = new Role({
      ...roleData,
      permissions: roleData.permissions || [],
      created_at: new Date(),
      updated_at: new Date()
    })
    return await role.save()
  }

  async getTotalRoles() {
    return await Role.countDocuments()
  }

  async getAllRoles() {
    return await Role.find().populate('permissions', 'action').sort({ created_at: -1 })
  }

  async getRoleById(roleId: string) {
    return await Role.findById(roleId).populate('permissions', 'code name description module action')
  }

  async getRoleByName(name: string) {
    return await Role.findOne({
      name
    })
  }

  async updateRole(roleId: string, updateData: UpdateRoleRequestBody) {
    return await Role.findByIdAndUpdate(roleId, { ...updateData, updated_at: new Date() }, { new: true }).populate(
      'permissions',
      'code name description module action'
    )
  }

  async deleteRole(roleId: string) {
    return await Role.findByIdAndDelete(roleId)
  }

  async getUsersWithRole(roleId: string) {
    return await User.find({ roles: roleId })
  }

  async assignPermissionsToRole(roleId: string, permissions: string[]) {
    return await Role.findByIdAndUpdate(
      roleId,
      { permissions: permissions, updated_at: new Date() },
      { new: true }
    ).populate('permissions', 'code name description module action')
  }
}

const roleRepository = new RoleRepository()
export default roleRepository
