import { Permission, Role } from '~/models'
import {
  PermissionAction,
  PermissionCodes,
  PermissionModule,
  PermissionRoles
} from '~/constants/enum/permision/permission.enum'

class PermissionService {
  async initializePermissions() {
    const defaultPermissions = [
      {
        code: PermissionCodes.GET,
        name: 'View/Get Data',
        description: 'Permission to view and retrieve data',
        module: PermissionModule.SYSTEM,
        action: PermissionAction.GET
      },
      {
        code: PermissionCodes.ADD,
        name: 'Add/Create Data',
        description: 'Permission to create new data',
        module: PermissionModule.SYSTEM,
        action: PermissionAction.ADD
      },
      {
        code: PermissionCodes.UPDATE,
        name: 'Update/Edit Data',
        description: 'Permission to update existing data',
        module: PermissionModule.SYSTEM,
        action: PermissionAction.UPDATE
      },
      {
        code: PermissionCodes.DELETE,
        name: 'Delete Data',
        description: 'Permission to delete data',
        module: PermissionModule.SYSTEM,
        action: PermissionAction.DELETE
      }
    ]

    for (const permData of defaultPermissions) {
      const existingPerm = await Permission.findOne({ code: permData.code })
      if (!existingPerm) {
        await Permission.create(permData)
      }
    }
  }

  async initializeRoles() {
    const allPermissions = await Permission.find()
    const getPermission = await Permission.findOne({ code: PermissionCodes.GET })

    const defaultRoles = [
      {
        name: 'Administrator',
        code: PermissionRoles.ADMIN,
        description: 'Full system access',
        permissions: allPermissions.map((p) => p._id)
      },
      {
        name: 'Common User',
        code: PermissionRoles.USER,
        description: 'Basic user access',
        permissions: getPermission ? [getPermission._id] : []
      },
      {
        name: 'Manager',
        code: PermissionRoles.MANAGER,
        description: 'Manager access',
        permissions: getPermission ? [getPermission._id] : []
      }
    ]

    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ code: roleData.code })
      if (!existingRole) {
        await Role.create(roleData)
      }
    }
  }

  async getUserPermissions(roleIds: string[]) {
    const roles = await Role.find({ _id: { $in: roleIds } }).populate('permissions')
    const permissions = new Set()

    roles.forEach((role) => {
      role.permissions.forEach((perm: any) => {
        permissions.add(perm.code)
      })
    })
    return Array.from(permissions)
  }

  async hasPermission(roleIds: string[], permissionCode: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(roleIds)
    return userPermissions.includes(permissionCode)
  }

  async getRoleByCode(code: string) {
    return await Role.findOne({ code }).populate('permissions')
  }

  async getAllPermissions() {
    return await Permission.find()
  }

  async getAllRoles() {
    return await Role.find().populate('permissions')
  }
}

const permissionService = new PermissionService()

export default permissionService
