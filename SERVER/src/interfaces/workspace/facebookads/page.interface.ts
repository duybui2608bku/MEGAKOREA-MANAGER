export interface CreatePostRequestBody {
  url: string
  page_name: string
  page_id: string
  services: string
}

export interface UpdatePostRequestBody {
  url?: string
  page_name?: string
  page_id?: string
  services?: string
}

export interface GetAllPostsQuery {
  current?: string
  pageSize?: string
  search?: string
  page_name?: string
  page_id?: string
  services?: string
  start_date?: string
  end_date?: string
}
