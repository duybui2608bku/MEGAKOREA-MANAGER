import { Permission, Role } from '~/models'
import {
  CreatePermissionRequestBody,
  UpdatePermissionRequestBody,
  GetPermissionsQuery
} from '~/interfaces/permission/permission.interface'

class PermissionRepository {
  async createPermission(permissionData: CreatePermissionRequestBody) {
    const permission = new Permission({
      ...permissionData,
      created_at: new Date(),
      updated_at: new Date()
    })
    return await permission.save()
  }

  async getAllPermissions(query: GetPermissionsQuery) {
    const filter: any = {}

    if (query.module) {
      filter.module = { $regex: query.module, $options: 'i' }
    }

    if (query.action) {
      filter.action = { $regex: query.action, $options: 'i' }
    }

    return await Permission.find(filter).sort({ module: 1, action: 1, created_at: -1 })
  }

  async getPermissionById(permissionId: string) {
    return await Permission.findById(permissionId)
  }

  async getPermissionByCode(code: string) {
    return await Permission.findOne({ code })
  }

  async updatePermission(permissionId: string, updateData: UpdatePermissionRequestBody) {
    return await Permission.findByIdAndUpdate(permissionId, { ...updateData, updated_at: new Date() }, { new: true })
  }

  async deletePermission(permissionId: string) {
    return await Permission.findByIdAndDelete(permissionId)
  }

  async getRolesWithPermission(permissionId: string) {
    return await Role.find({ permissions: permissionId })
  }

  async getPermissionsByRoleIds(roleIds: string[]) {
    const roles = await Role.find({ _id: { $in: roleIds } }).populate('permissions')
    const permissions: any[] = []

    roles.forEach((role) => {
      if (role.permissions) {
        permissions.push(...role.permissions)
      }
    })

    // Remove duplicates
    const uniquePermissions = permissions.filter(
      (permission, index, self) => index === self.findIndex((p) => p._id.toString() === permission._id.toString())
    )

    return uniquePermissions
  }
}

const permissionRepository = new PermissionRepository()
export default permissionRepository
