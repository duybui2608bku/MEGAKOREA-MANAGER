export interface GetAllEmployeesParams {
  current: number
  pageSize: number
  search?: string
  department?: string
  roles?: string
  status?: string
}
