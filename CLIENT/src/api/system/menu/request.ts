export interface GetAllMenusRequestQuery {
  page: number
  pageSize: number
  status?: string
  parentId?: string
  roles?: string
}
