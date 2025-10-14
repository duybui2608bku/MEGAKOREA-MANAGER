export interface UpdateProfileByAdminRequestBody {
  user_id: string
  name?: string
  password?: string
  phone?: string
  date_of_birth?: Date
  derpartment?: string
  status?: number
  address?: string
  avatar?: string
  gender?: number
  titles?: number
}

export interface GetAllUsersQuery {
  page: number
  limit: number
  search: string
  department: string
  status: string
}

export interface UpdateUserStatusRequestBody {
  status: number
}

export interface AssignUserRoleRequestBody {
  roleIds: string[]
}

export interface AssignUserDepartmentRequestBody {
  departmentId: string
}
