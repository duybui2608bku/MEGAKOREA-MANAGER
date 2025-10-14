export interface CreateRoleRequestBody {
  name: string
  code: string
  description?: string
  permissionIds?: string[]
}

export interface UpdateRoleRequestBody {
  name?: string
  code?: string
  description?: string
  permissionIds?: string[]
  status?: number
}

export interface AssignPermissionsRequestBody {
  permissionIds: string[]
}
