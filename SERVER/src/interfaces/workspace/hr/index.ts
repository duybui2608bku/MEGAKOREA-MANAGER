export interface UpdateEmployeeProfileRequestBody {
  _id?: string
  name?: string
  phone?: string
  password?: string
  gender?: number
  date_of_birth?: Date
  roles?: string[]
  status?: number
  address?: string
  avatar?: string
  department?: string
}

export interface GetAllEmployeesQuery {
  current?: string
  pageSize?: string
  name?: string
  email?: string
  phone?: string
  department?: string
  roles?: string
  status?: string
  created_at?: string
}
