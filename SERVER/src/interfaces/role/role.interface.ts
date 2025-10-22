export interface CreateRoleRequestBody {
  name: string
  code: string
  description?: string
  permissions?: string[]
}

export interface UpdateRoleRequestBody {
  name?: string
  code?: string
  description?: string
  permissions?: string[]
  status?: number
}

export interface AssignPermissionsRequestBody {
  permissionIds: string[]
}
