export interface GetAllEmployeesParams {
  current: number
  pageSize: number
  search?: string
  department?: string
  roles?: string
  status?: string
}

export interface UpdateEmployeeRequestBody {
  _id: string
  name?: string
  phone?: string
  date_of_birth?: Date
  address?: string
  avatar?: string
  gender?: number
  roles?: string[]
  department?: string
}
