export interface CreatePermissionRequestBody {
  code: string
  name: string
  description?: string
  module: string
  action: string
}

export interface UpdatePermissionRequestBody {
  code?: string
  name?: string
  description?: string
  module?: string
  action?: string
}

export interface GetPermissionsQuery {
  module: string
  action: string
}
