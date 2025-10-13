export enum PermissionAction {
  GET = 'get',
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum PermissionRoles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export enum PermissionCodes {
  GET = 'permission:button:get',
  ADD = 'permission:button:add',
  UPDATE = 'permission:button:update',
  DELETE = 'permission:button:delete'
}

export enum PermissionModule {
  SYSTEM = 'system',
  USER = 'user',
  DEPARTMENT = 'department'
}
