export interface CreateDepartmentRequestBody {
  name: string
  description?: string
}

export interface UpdateDepartmentRequestBody {
  name?: string
  description?: string
}

export interface DeleteDepartmentParams {
  id: string
}

export interface GetDepartmentByIdParams {
  id: string
}

export interface UpdateDepartmentParams {
  id: string
}
