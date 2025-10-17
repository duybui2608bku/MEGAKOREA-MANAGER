export interface CreateMenuRequestBody {
  path: string
  component?: string
  name: string
  title: string
  icon?: string
  order?: number
  parentId?: string
  roles?: string[]
  permissions?: string[]
  status?: number
  isExternal?: boolean
  keepAlive?: boolean
  hidden?: boolean
}

export interface UpdateMenuRequestBody {
  path?: string
  component?: string
  name?: string
  title?: string
  icon?: string
  order?: number
  parentId?: string
  roles?: string[]
  permissions?: string[]
  status?: number
  isExternal?: boolean
  externalLink?: string
  iframeLink?: string
  keepAlive?: boolean
  hidden?: boolean
}

export interface GetMenusQuery {
  status?: string
  name?: string
  hideInMenu?: string
  current?: string
  pageSize?: string
}
