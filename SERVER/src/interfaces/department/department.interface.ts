export interface CreateDepartmentRequestBody {
  name: string
  description?: string
}

export interface UpdateDepartmentRequestBody {
  name?: string
  description?: string
}
