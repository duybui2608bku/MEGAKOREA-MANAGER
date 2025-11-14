export interface ContentTextType {
  _id: string
  content: string
  category: string
  branch: string
  services: string
  created_at: Date
  updated_at: Date
}

export interface CreateContentTextRequestBody {
  content: string
  category: string
  branch: string
  services: string
}

export interface UpdateContentTextRequestBody {
  content?: string
  category?: string
  branch?: string
  services?: string
}

export interface GetAllContentTextsQuery {
  current?: string
  pageSize?: string
  search?: string
  category?: string
  branch?: string
  services?: string
  start_date?: string
  end_date?: string
}

