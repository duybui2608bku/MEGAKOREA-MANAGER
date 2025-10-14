import { Role, User } from '~/models'
import { CreateRoleRequestBody, UpdateRoleRequestBody } from '~/interfaces/role/role.interface'

class RoleRepository {
  async createRole(roleData: CreateRoleRequestBody) {
    const role = new Role({
      ...roleData,
      permissions: roleData.permissionIds || [],
      created_at: new Date(),
      updated_at: new Date()
    })
    return await role.save()
  }

  async getAllRoles() {
    return await Role.find().populate('permissions', 'code name description module action').sort({ created_at: -1 })
  }

  async getRoleById(roleId: string) {
    return await Role.findById(roleId).populate('permissions', 'code name description module action')
  }

  async getRoleByNameOrCode(name: string, code: string) {
    return await Role.findOne({
      $or: [{ name }, { code }]
    })
  }

  async updateRole(roleId: string, updateData: UpdateRoleRequestBody) {
    const updateFields: any = { ...updateData, updated_at: new Date() }

    if (updateData.permissionIds) {
      updateFields.permissions = updateData.permissionIds
      delete updateFields.permissionIds
    }

    return await Role.findByIdAndUpdate(roleId, updateFields, { new: true }).populate(
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

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    return await Role.findByIdAndUpdate(
      roleId,
      { permissions: permissionIds, updated_at: new Date() },
      { new: true }
    ).populate('permissions', 'code name description module action')
  }
}

const roleRepository = new RoleRepository()
export default roleRepository
